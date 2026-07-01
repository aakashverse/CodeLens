const { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { createStuffDocumentsChain } = require("langchain/chains/combine_documents");
const { createRetrievalChain } = require("langchain/chains/retrieval");
const { PromptTemplate } = require("@langchain/core/prompts");

const { getVectorStore } = require("../utils/vectorStore"); 
const User = require("../models/user.models");

const { decrypt } = require("../utils/encryption");

async function generateArchitecture(req, res) {
    const user = await User.findById(req.user.id);

    if (!user.geminiApiKey) {
      return res.status(400).json({ error: "Please configure your API key in Settings." });
    }
    
    const { githubUrl } = req.body;
    
    if(!githubUrl){
        return res.status(400).json({ error: "GitHub URL is required." });
    }

    const repoName = githubUrl.split('/').pop().replace('.git', '');
    const encryptedKey = decrypt(user.geminiApiKey);

    const prompt = PromptTemplate.fromTemplate(`
        You are CodeLens AI, an elite software architect. 
        Your task is to analyze the provided codebase context and extract its high-level system architecture.

        CRITICAL INSTRUCTIONS:
        1. You must respond ONLY with a valid, raw JSON object. 
        2. DO NOT include markdown formatting, code blocks (e.g., \`\`\`json), greetings, or explanations.
        3. If a specific layer is not found in the context, return an empty array [].

        Expected JSON Schema:
        {{
          "frontend": ["array of strings: top frontend frameworks/libraries (e.g., React, Tailwind)"],
          "backend": ["array of strings: top backend technologies (e.g., Node.js, Express)"],
          "database": ["array of strings: databases or ORMs (e.g., MongoDB, Mongoose)"],
          "cloud": ["array of strings: cloud services, hosting, or infrastructure (e.g., AWS, Vercel, Docker)"],
          "tree": ["array of strings: the 6 to 8 most important root-level file/folder paths (e.g., 'src/', 'package.json')"]
        }}

        Codebase Context:
        {context}

        Developer's query:
        {input}
    `);

    try {
        const model = new ChatGoogleGenerativeAI({
            apiKey: encryptedKey,
            model: user.aiModel,
            temperature: 0.1, 
            modelKwargs: {
                responseMimeType: "application/json",
            }
        });

        const embeddings = new GoogleGenerativeAIEmbeddings({
            apiKey: encryptedKey,
            model: "gemini-embedding-001", 
        });

        const vectorStore = await getVectorStore(embeddings);

        if (!vectorStore) {
            return res.status(400).json({ error: "No repository indexed. Please connect a repo first." });
        }

        const combineDocsChain = await createStuffDocumentsChain({ llm: model, prompt });
        
        const retriever = vectorStore.asRetriever({
            k: 3, 
            filter: {
                preFilter: {
                    "repoName": { $eq: repoName } 
                }
            }
        });

        const query = "Analyze the provided context and extract the technologies into the exact JSON schema requested. Keep it factual and concise.";
        const retrievedDocs = await retriever.invoke(String(query));

        const response = await combineDocsChain.invoke({
            input: String(query),
            context: retrievedDocs
        });

        let parsedAnswer;
        try {
            parsedAnswer = JSON.parse(response);
            console.log("Architecture Extraction Complete: ", parsedAnswer);
        } catch(parseError) {
            console.error("Failed to parse LLM response as JSON:", response);
            return res.status(500).json({ error: "Failed to generate a valid architecture format." });
        }

        return res.status(200).json({
            answer: parsedAnswer
        });

    } catch (error) {
        console.error("Architecture Extraction Error: ", error);
        return res.status(500).json({ error: "An internal server error occurred while analyzing the codebase." });
    }
}

module.exports = {
    generateArchitecture
};