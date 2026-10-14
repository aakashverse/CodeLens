const fs = require('fs').promises;
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
const { PromptTemplate } = require("@langchain/core/prompts");

const { cloneAndExtract } = require('../utils/githubFetcher');
const { getVectorStore } = require("../utils/vectorStore");
const { MongoClient } = require("mongodb");
const User = require("../models/user.models");
const { decrypt } = require("../utils/encryption");

const client = new MongoClient(process.env.MONGO_URI);
const collectionName = "code_embeddings";
const dbName = "codelens";

async function initializeRepoSession(req, res) {
    const user = await User.findById(req.user.id);

    if (!user || !user.geminiApiKey) {
        return res.status(400).json({ error: "Please configure your API key in Settings." });
    }

    const { githubUrl } = req.body;

    if (!githubUrl) {
        return res.status(400).json({ error: "GitHub URL is required." });
    }

    const repoName = githubUrl.split('/').pop().replace('.git', '');
    const decryptedKey = decrypt(user.geminiApiKey);

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
                if (!content || !content.trim()) continue; // Skip empty files

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

        if (rawDocuments.length === 0) {
            await fs.rm(targetDir, { recursive: true, force: true });
            return res.status(400).json({ error: "No readable code files found in the repository." });
        }

        // Chunk code into logical segments
        console.log(`[Atlas RAG] 3. Splitting text into chunks...`);
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1500,
            chunkOverlap: 200,
        });

        const rawSplitDocs = await textSplitter.createDocuments(
            rawDocuments.map(doc => doc.pageContent),
            rawDocuments.map(doc => doc.metadata)
        );

        // Filter out any empty chunks
        const splitDocs = rawSplitDocs.filter(doc => doc.pageContent && doc.pageContent.trim().length > 0);

        console.log(`[Atlas RAG] 4. Clearing old vectors for ${repoName}...`);
        await client.connect();
        const collection = client.db(dbName).collection(collectionName);
        await collection.deleteMany({ "repoName": repoName });

        // Embeddings setup with Gemini (3072 dimensions matching Atlas Vector Index)
        const embeddings = new GoogleGenerativeAIEmbeddings({
            apiKey: decryptedKey,
            model: "gemini-embedding-001",
        });

        // Generate Embeddings and Store in Batches
        console.log(`[Atlas RAG] 5. Embedding ${splitDocs.length} chunks into Atlas Vector Store...`);
        try {
            await getVectorStore(embeddings, splitDocs);
            console.log(`[Atlas RAG] Successfully stored vectors in MongoDB!`);
        } catch (err) {
            console.error("[Atlas RAG] Embedding step failed:", err);
            return res.status(500).json({ error: "Embedding generation failed: " + err.message });
        }

        // Clean up temp directory
        console.log(`[Atlas RAG] 6. Cleaning up temporary files...`);
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

async function chatWithCodebase(req, res) {
    const user = await User.findById(req.user.id);

    if (!user || !user.geminiApiKey) {
        return res.status(400).json({ error: "Please configure your API key in Settings." });
    }

    const decryptedKey = decrypt(user.geminiApiKey);
    const { question, githubUrl } = req.body;

    if (!question || !githubUrl) {
        return res.status(400).json({ error: "Question and githubUrl are required." });
    }

    const repoName = githubUrl.split('/').pop().replace('.git', '');

    try {
        const model = new ChatGoogleGenerativeAI({
            apiKey: decryptedKey,
            model: user.aiModel || "gemini-3.8-flash",
            temperature: 0.2,
        });

        const embeddings = new GoogleGenerativeAIEmbeddings({
            apiKey: decryptedKey,
            model: "gemini-embedding-001",
        });

        const vectorStore = await getVectorStore(embeddings);

        const retrievedDocs = await vectorStore.similaritySearch(
            String(question),
            3,
            {
                preFilter: {
                    repoName: { $eq: repoName }
                }
            }
        );

        console.log(`[Atlas RAG] Retrieved ${retrievedDocs.length} chunks for repo: ${repoName}`);

        if (retrievedDocs.length === 0) {
            console.warn(`[Atlas RAG] 0 chunks retrieved for repo: ${repoName}.`);
        }

        const formattedContext = retrievedDocs.length > 0
            ? retrievedDocs.map(doc => `File: ${doc.metadata?.source || 'unknown'}\n${doc.pageContent}`).join("\n\n---\n\n")
            : "No indexed context available for this repository yet.";

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

        const chain = prompt.pipe(model);
        const response = await chain.invoke({
            input: String(question),
            context: formattedContext
        });

        return res.status(200).json({
            answer: response.content
        });

    } catch (error) {
        console.error("[Atlas RAG Error]", error);
        return res.status(500).json({
            error: error?.message || "AI failed to process code context query."
        });
    }
}

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

        const existingDoc = await collection.findOne({
            "repoName": repoName,
            "embedding.0": { $exists: true } // Only count as indexed if embedding array is non-empty!
        });

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