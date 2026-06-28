const fs = require('fs').promises;
const simpleGit = require("simple-git");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { createStuffDocumentsChain } = require("langchain/chains/combine_documents");
const { createRetrievalChain } = require("langchain/chains/retrieval");
const { PromptTemplate } = require("@langchain/core/prompts");

const { cloneAndExtract } = require('../utils/githubFetcher');
const { getVectorStore } = require("../utils/vectorStore");
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);
const collectionName = "code_embeddings";
const dbName = "codelens";

/**
 * Endpoint: POST /api/repo/connect
 * Reads, chunks, embeds, and saves repository files.
 */
async function initializeRepoSession(req, res){
    const { githubUrl } = req.body;

    if(!githubUrl){
        return res.status(400).json({ error: "GitHub URL is required." });
    }

    const repoName = githubUrl.split('/').pop().replace('.git', '');

    try {
        console.log(`\n[Atlas RAG] 1. Initializing session for: ${repoName}`);

        // Fetch files
        const { targetDir, filePaths } = await cloneAndExtract(githubUrl, repoName);

        // Read contents
        console.log(`[Atlas RAG] 2. Reading ${filePaths.length} files...`);

        const timeStamp = new Date().toISOString(); 

        const rawDocuments = [];
        for (const filePath of filePaths) {
            try {
                const content = await fs.readFile(filePath, 'utf-8');
                const relativePath = filePath.replace(targetDir, '');
                rawDocuments.push({
                    pageContent: content,
                    metadata: { 
                        source: relativePath,
                        repoName: repoName, 
                        indexedAt: timeStamp
                    }
                });
            } catch (readErr) {
                console.warn(`[Atlas RAG] Skipped unreadable file: ${filePath}`);
            }
        }

        // Chunk code into logical segments
        console.log(`[Atlas RAG] 3. Splitting text into chunks...`);
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1500, 
            chunkOverlap: 200,
        });
        
        const splitDocs = await textSplitter.createDocuments(
            rawDocuments.map(doc => doc.pageContent),
            rawDocuments.map(doc => doc.metadata)
        );

        console.log(`[Atlas RAG] 4. Initializing Google Embeddings...`);
        const embeddings = new GoogleGenerativeAIEmbeddings({
            apiKey: process.env.GOOGLE_API_KEY,
            modelName: "gemini-embedding-001", 
            maxConcurrency: 1, 
            maxRetries: 2
        });

        const collection = client.db(dbName).collection(collectionName);
        
        // avoid duplicates based on the Langchain metadata structural mapping path
        await collection.deleteMany({ "repoName": repoName });
        console.log(`[Atlas RAG] Cleared old vectors for ${repoName}`);

        // Generate Embeddings and Store
        console.log(`[Atlas RAG] 6. Embedding ${splitDocs.length} chunks into Atlas Vector Store...`);
        try {
            
            const vectorStore = await getVectorStore(embeddings, splitDocs);
            console.log(`[Atlas RAG] Successfully stored vectors in MongoDB!`);
        } catch (err) {
            console.error("Embedding failed:", err);
            return res.status(500).json({ error: "Embedding step failed", details: err.message });
        }
        
        // Clean up temp directory
        console.log(`[Atlas RAG] 7. Cleaning up temporary files...`);
        await fs.rm(targetDir, { recursive: true, force: true });
        
        console.log(`[Atlas RAG] Indexing complete for ${repoName} ✅`);

        return res.status(200).json({ 
            message: "Repository successfully indexed in MongoDB",
            chunksProcessed: splitDocs.length
        });

    } catch (error) {
        console.error("[Atlas RAG Error] Initialization failed:", error);
        return res.status(500).json({ error: error.message || "Failed to initialize codebase vector index." });
    }
}

/**
 * Endpoint: POST /api/repo/chat
 * Performs similarity search and answers code questions.
 */
async function chatWithCodebase(req, res){
    const { question, githubUrl } = req.body;

    if (!question || !githubUrl) {
        return res.status(400).json({ error: "Question or githubUrl are required." });
    }

    const repoName = githubUrl.split('/').pop().replace('.git', '');

    try {
        const model = new ChatGoogleGenerativeAI({
            model: "gemini-2.5-flash",
            apiKey: process.env.GOOGLE_API_KEY,
            temperature: 0.1, 
        });

        const embeddings = new GoogleGenerativeAIEmbeddings({
            apiKey: process.env.GOOGLE_API_KEY,
            modelName: "gemini-embedding-001",
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
        const vectorStore = await getVectorStore(embeddings);

        const retriever = vectorStore.asRetriever({
            k: 5, 
            filter: {
                preFilter: {
                    "repoName": { $eq: repoName } 
                }
            }
        });

        const retrievedDocs = await retriever.invoke(String(question));
        const response = await combineDocsChain.invoke({
            input: String(question),
            context: retrievedDocs
        });

        console.log(response);

        return res.status(200).json({ 
            answer: response 
        });

    } catch (error) {
        console.error("[Atlas RAG Error] Inference generation failed:", error);
        return res.status(500).json({ error: "AI failed to process code context query." });
    }
};

/**
 * Endpoint: GET /api/repo/check-status
 */
async function checkRepoStatus(req, res) {
    const { githubUrl } = req.query;
    if (!githubUrl) {
        return res.status(400).json({ error: "GitHub URL is required." });
    }

    const repoName = githubUrl.split('/').pop().replace('.git', '');

    try {
        await client.connect();
        const collection = client.db(dbName).collection(collectionName);

        const existingDoc = await collection.findOne({ "repoName": repoName });

        if (existingDoc) {
            return res.status(200).json({
                isIndexed: true,
                lastIndexed: existingDoc?.indexedAt || "an unknown date"
            });
        } else {
            return res.status(200).json({ isIndexed: false });
        }
    } catch (error) {
        console.error("Status Check Error:", error);
        return res.status(500).json({ error: "Failed to check repository status." });
    }
}

module.exports = {
    initializeRepoSession,
    chatWithCodebase,
    checkRepoStatus
};