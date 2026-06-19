const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { createStuffDocumentsChain } = require("langchain/chains/combine_documents");
const { createRetrievalChain } = require("langchain/chains/retrieval");
const { PromptTemplate } = require("@langchain/core/prompts");

const {getVectorStore} = require("../services/vectorStore.service"); 

// analyzer function
async function AnalyzeCode(req, res) {
    const vectorStore = getVectorStore();

    if (!vectorStore) {
        return res.status(400).json({ error: "No repository indexed. Please connect a repo first." });
    }

    const prompt = PromptTemplate.fromTemplate(`
        You are CodeLens AI, an elite static code analyzer and senior software architect. 
        Your task is to analyze the provided codebase context and identify code smells, anti-patterns, security risks, and performance bottlenecks.

        CRITICAL INSTRUCTIONS:
        1. You must respond ONLY with a valid, raw JSON object. 
        2. DO NOT wrap the response in markdown code blocks (e.g., no \`\`\`json).
        3. DO NOT include any conversational text, greetings, or explanations.
        4. Calculate a 'healthScore' from 0 to 100. Start at 100 and deduct points based on the severity and quantity of issues found (High = -10, Medium = -5, Low = -2). If no issues are found, return 100.

        Expected JSON Schema:
        {{
          "healthScore": a number btw 1-100,
          "issues": [
            {{
              "severity": "high | medium | low",
              "type": "Short string (e.g., 'N+1 Query', 'Memory Leak', 'Hardcoded Secret')",
              "file": "String representing the file path (e.g., 'src/routes/api.js') or 'Global' if it applies to the whole context",
              "line": "String or number representing the line number or function name (or null if unknown)",
              "message": "A clear, 1-2 sentence explanation of why this is a problem and how the developer should fix it."
            }}
          ]
        }}

        Codebase Context:
        {context}

        Developer's query:
        {input}

        Analyze the codebase and generate the raw JSON report now:
    `);

    try {
        const model = new ChatGoogleGenerativeAI({
            model: "gemini-2.5-flash",
            apiKey: process.env.GOOGLE_API_KEY,
            temperature: 0.1, 
            modelKwargs: {
                responseMimeType: "application/json",
            }
        });

        const combineDocsChain = await createStuffDocumentsChain({ llm: model, prompt });
        const retrieval = await createRetrievalChain({
            retriever: vectorStore.asRetriever(8), 
            combineDocsChain
        });

        const query = "Perform a deep scan of the codebase context. Look for redundant database queries, inefficient React state management, security vulnerabilities, and architectural anti-patterns. Return the exact JSON schema requested concisely.";

        const response = await retrieval.invoke({ input: query });

        let parsedAnswer;
        try {
            parsedAnswer = JSON.parse(response.answer);
            console.log("Architecture: ", parsedAnswer);
        } catch(parseError) {
            console.error("Failed to parse LLM response as JSON:", response.answer);
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
    AnalyzeCode
};