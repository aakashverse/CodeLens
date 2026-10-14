const { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { PromptTemplate } = require("@langchain/core/prompts");
const User = require("../models/user.models");
const { getVectorStore } = require("../utils/vectorStore");
const { decrypt } = require("../utils/encryption");

// create readme function
async function generateReadme(req, res) {
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
        const model = new ChatGoogleGenerativeAI({
            apiKey: decryptedKey,
            model: user.aiModel || "gemini-3.8-flash",
            temperature: 0.2,
        });

        const embeddings = new GoogleGenerativeAIEmbeddings({
            apiKey: decryptedKey,
            model: "gemini-embedding-001",
        });

        const prompt = PromptTemplate.fromTemplate(`
            Generate a professional 'README.md' using the project context retrieved from the vector store.
            
            Strict Requirements:
            * Use only information found in the retrieved context.
            * Do not hallucinate missing details.
            * Keep the README concise and developer-focused.
            * Be as concise as possible.
                
            Include:
            * Project Overview
            * Features
            * Tech Stack
            * Usage
            * Project Structure
            * Installation
            
            Codebase Context:
            {context}

            Developer's query:
            {input}
                
            Return only the README in Markdown format.
        `);

        const vectorStore = await getVectorStore(embeddings);

        if (!vectorStore) {
            return res.status(400).json({ error: "No repository indexed. Please connect a repo first." });
        }

        const query = "Generate a proper README.md file, strictly follow the prompt & use the given context only.";
        const retrievedDocs = await vectorStore.similaritySearch(
            query,
            3,
            {
                preFilter: {
                    repoName: { $eq: repoName }
                }
            }
        );

        const formattedContext = retrievedDocs.length > 0
            ? retrievedDocs.map(doc => `File: ${doc.metadata?.source || 'unknown'}\n${doc.pageContent}`).join("\n\n---\n\n")
            : "No indexed context available for this repository yet.";

        const chain = prompt.pipe(model);
        const response = await chain.invoke({
            input: String(query),
            context: formattedContext
        });

        return res.status(200).json({
            answer: response.content
        });

    } catch (error) {
        console.error("Readme Generation Error: ", error);
        return res.status(500).json({ error: "Failed to generate README: " + (error.message || error) });
    }
}

module.exports = {
    generateReadme
};