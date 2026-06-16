const fs = require('fs').promises;
const simpleGit = require("simple-git");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
// Import completely free Google Gemini models
const { GoogleGenerativeAIEmbeddings , ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { createStuffDocumentsChain } = require("langchain/chains/combine_documents");
const { createRetrievalChain } = require("langchain/chains/retrieval");
const { PromptTemplate } = require("@langchain/core/prompts");

const { cloneAndExtract } = require('../utils/githubFetcher');

// Global reference for the active session's vector storage
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
        console.log(`[Free RAG] Initializing free session for: ${repoName}`);

        // 1. Fetch files using your existing git utility
        const { targetDir, filePaths } = await cloneAndExtract(githubUrl, repoName);

        // 2. Read contents into memory
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

        // 3. Chunk code into logical segments
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 2000, // Gemini handles larger chunks beautifully
            chunkOverlap: 300,
        });
        
        const splitDocs = await textSplitter.createDocuments(
            rawDocuments.map(doc => doc.pageContent),
            rawDocuments.map(doc => doc.metadata)
        );

        // 4. Generate Free Embeddings via text-embedding-004
        console.log(`[Free RAG] Generating free embeddings for ${splitDocs.length} chunks...`);
        try {
            activeVectorStore = await MemoryVectorStore.fromDocuments(
              splitDocs,
              new GoogleGenerativeAIEmbeddings({
                apiKey: process.env.GOOGLE_API_KEY,
                model: "text-embedding-004",
            })
        )} catch (err) {
            console.error("Embedding failed:", err);
            return res.status(500).json({
                error: "Embedding step failed",
                details: err.message
            });
        }
        console.log(activeVectorStore);
        
        // 5. Clean up temporary directory
        await fs.rm(targetDir, { recursive: true, force: true });
        console.log(`[Free RAG] Indexing complete for ${repoName}`);

        return res.status(200).json({ 
            message: "Repository successfully indexed using free models.",
            chunksProcessed: splitDocs.length
        });


    } catch (error) {
        console.error("[Free RAG Error] Initialization failed:", error);
        return res.status(500).json({ error: "Failed to initialize codebase vector index." });
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
        // Initialize the free Gemini Flash model (highly accurate for code processing)
        const model = new ChatGoogleGenerativeAI({
            modelName: "gemini-1.5-flash",
            apiKey: process.env.GOOGLE_API_KEY,
            temperature: 0.1, // Keeps code interpretations factual
        });

        const prompt = PromptTemplate.fromTemplate(`
            You are CodeLens AI, an advanced full-stack development assistant.
            Analyze the provided codebase snippets to answer the user's inquiry thoroughly.
            
            Guidelines:
            - Rely strictly on the code provided in the context.
            - If the context doesn't contain the answer, explicitly state that it cannot be found in the current files.
            - Always cite the specific file path from the context metadata when referencing code blocks.

            Codebase Context:
            {context}

            Developer Question: {input}
            System Answer:
        `);

        // Assemble the LangChain RAG pipeline
        const combineDocsChain = await createStuffDocumentsChain({ llm: model, prompt });
        const retrievalChain = await createRetrievalChain({
            retriever: activeVectorStore.asRetriever(8), // Can safely retrieve more context chunks due to large context limits
            combineDocsChain,
        });

        // Run the query execution
        const response = await retrievalChain.invoke({ input: question });
        console.log(response);

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