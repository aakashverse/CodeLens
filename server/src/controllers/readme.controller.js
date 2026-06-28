const { MongoClient } = require("mongodb");
const { MongoDBAtlasVectorSearch } = require("@langchain/mongodb");
const { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { createStuffDocumentsChain } = require("langchain/chains/combine_documents");
const { PromptTemplate } = require("@langchain/core/prompts");

const { getVectorStore } = require("../utils/vectorStore");

// create readme function
async function generateReadme(req, res) {
    const { githubUrl } = req.body;

    if (!githubUrl) {
        return res.status(400).json({ error: "GitHub URL is required." });
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

        const combineDocsChain = await createStuffDocumentsChain({llm: model, prompt}); 
        const vectorStore = await getVectorStore(embeddings);
        
        const retriever = vectorStore.asRetriever({
            k: 3, 
            filter: {
                preFilter: {
                    "repoName": { $eq: repoName } 
                }
            }
        });

        const query = "Generate a proper README.md file, strictly follow the prompt & use the given context only."
        const retrievedDocs = await retriever.invoke(String(query));

        const response = await combineDocsChain.invoke({
            input: String(query),
            context: retrievedDocs
        });

        return res.status(200).json({
            answer: response 
        })

    } catch (error) {
        console.error("Readme Generation Error: ", error);
        return res.status(500).json({ error: "Failed to generate README." });
    }
}

module.exports = {
    generateReadme
};