const fs = require('fs').promises;
const simpleGit = require("simple-git");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { createStuffDocumentsChain } = require("langchain/chains/combine_documents");
const { createRetrievalChain } = require("langchain/chains/retrieval");
const { PromptTemplate } = require("@langchain/core/prompts");

const { cloneAndExtract } = require('../utils/githubFetcher');

let activeVectorStore = null;

/**
 * Endpoint: POST /api/repo/connect
 * Reads, chunks, embeds, and saves repository files for free.
 */
const initializeRepoSession = async (req, res) => {
    const { githubUrl } = req.body;

    if (!githubUrl) {
        return res.status(400).json({ error: "GitHub URL is required." });
    }

    const repoName = githubUrl.split('/').pop().replace('.git', '');

    try {
        console.log(`\n[Free RAG] 1. Initializing session for: ${repoName}`);

        // Fetch files using gitFetcher()
        const { targetDir, filePaths } = await cloneAndExtract(githubUrl, repoName);

        // Read contents into memory
        console.log(`[Free RAG] 2. Reading ${filePaths.length} files...`);
        const rawDocuments = [];
        for (const filePath of filePaths) {
            try {
                const content = await fs.readFile(filePath, 'utf-8');
                const relativePath = filePath.replace(targetDir, '');
                rawDocuments.push({
                    pageContent: content,
                    metadata: { source: relativePath }
                });
            } catch (readErr) {
                console.warn(`[Free RAG] Skipped unreadable file: ${filePath}`);
            }
        }

        // Chunk code into logical segments
        console.log(`[Free RAG] 3. Splitting text into chunks...`);
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1500, 
            chunkOverlap: 200,
        });
        
        const splitDocs = await textSplitter.createDocuments(
            rawDocuments.map(doc => doc.pageContent),
            rawDocuments.map(doc => doc.metadata)
        );

        console.log(`[Free RAG] 4. Initializing Google Embeddings...`);
        const embeddings = new GoogleGenerativeAIEmbeddings({
            apiKey: process.env.GOOGLE_API_KEY,
            modelName: "gemini-embedding-001", 
            maxConcurrency: 1, 
            maxRetries: 2
        });

        // // --- PRE-TEST TO VERIFY API IS WORKING ---
        // console.log(`[Free RAG] 5. Pre-testing Google API connection...`);
        // const testVector = await embeddings.embedQuery("Hello world");
        // if (!testVector || testVector.length === 0) {
        //     throw new Error("Google API returned an empty vector. Your API key might be invalid or rate-limited.");
        // }
        // console.log(`[Free RAG] API Test Passed! Vector dimensionality: ${testVector.length}`);

        // Generate Embeddings and Store
        console.log(`[Free RAG] 6. Embedding ${splitDocs.length} chunks into MemoryVectorStore...`);
        try {
        
            activeVectorStore = await MemoryVectorStore.fromDocuments(
              splitDocs,
              embeddings
            );
            console.log(`[Free RAG] Successfully created vector store!`);
        } catch (err) {
            console.error("Embedding failed:", err);
            return res.status(500).json({ error: "Embedding step failed", details: err.message });
        }
        
        // Clean up temp directory
        console.log(`[Free RAG] 7. Cleaning up temporary files...`);
        await fs.rm(targetDir, { recursive: true, force: true });
        
        console.log(`[Free RAG] Indexing complete for ${repoName} ✅`);
        // console.log(activeVectorStore.memoryVectors[0].embedding);

        return res.status(200).json({ 
            message: "Repository successfully indexed using free models.",
            chunksProcessed: splitDocs.length
        });

    } catch (error) {
        console.error("[Free RAG Error] Initialization failed:", error);
        return res.status(500).json({ error: error.message || "Failed to initialize codebase vector index." });
    }
};

/**
 * Endpoint: POST /api/repo/chat
 * Performs similarity search and answers code questions for free.
 */
const chatWithCodebase = async (req, res) => {
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ error: "Question text is required." });
    }

    if (!activeVectorStore) {
        return res.status(400).json({ error: "No active workspace. Connect a repo first." });
    }

    try {
        const model = new ChatGoogleGenerativeAI({
            model: "gemini-2.5-flash",
            apiKey: process.env.GOOGLE_API_KEY,
            temperature: 0.1, 
        });

        const prompt = PromptTemplate.fromTemplate(`
            You are CodeLens AI, a sharp, concise software architect. 
            The developer is looking at their code on a split-screen UI right next to you. Treat this like a quick, helpful Slack chat.

            CRITICAL BEHAVIORAL INSTRUCTIONS:
            1. **Be Direct & Extremely Concise**: Answer EXACTLY what the user asked and nothing more. Do not summarize the entire codebase unless explicitly requested. If the question is simple, give a 1-2 sentence answer.
            2. **Scale Your Detail**: ONLY use bullet points or deep explanations if the user uses words like "explain", "how does", or "break down". Otherwise, keep it brief.
            3. **No Code Dumping**: The user can already see the code! NEVER output blocks of code. Use inline backticks purely for variable/function names (e.g., \`initServer()\`).
            4. **Always Cite Files**: When mentioning where something happens, bold the file path so they can click/look at it (e.g., "That is handled in **\`src/routes.js\`**").
            5. **Focus on the "Why"**: Don't read syntax back to them. Just state the architectural purpose briefly.

            STRICT CONSTRAINTS:
            - Base your answer ONLY on the provided context. Do not guess or hallucinate.
            - If the context does not contain the answer, simply say: "I don't see that in the currently indexed files."

            Codebase Context:
            {context}

            Developer Question: {input}
            System Answer:
        `);

        const combineDocsChain = await createStuffDocumentsChain({ llm: model, prompt });
        const retrievalChain = await createRetrievalChain({
            retriever: activeVectorStore.asRetriever(8), 
            combineDocsChain,
        });

        const response = await retrievalChain.invoke({ input: question });

        return res.status(200).json({ answer: response.answer });

    } catch (error) {
        console.error("[Free RAG Error] Inference generation failed:", error);
        return res.status(500).json({ error: "AI failed to process code context query." });
    }
};

module.exports = {
    initializeRepoSession,
    chatWithCodebase
};