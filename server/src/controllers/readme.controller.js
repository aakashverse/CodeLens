const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { createStuffDocumentsChain } = require("langchain/chains/combine_documents");
const { createRetrievalChain } = require("langchain/chains/retrieval");
const { PromptTemplate } = require("@langchain/core/prompts");

const {getVectorStore} = require("../controllers/workspace.controller"); // act as context for repo

// create readme function
async function generateReadme(req, res) {
    const vectorStore = getVectorStore();

    if (!vectorStore) {
        return res.status(400).json({ error: "No repository indexed. Please connect a repo first." });
    }

    const prompt = PromptTemplate.fromTemplate(`
        Generate a professional 'README.md' using the project context retrieved from the vector store.
        
        Strict Requirements:
        * Use only information found in the retrieved context.
        * Do not hallucinate missing details.
        * Keep the README concise and developer-focused.
        * Be as conscise as possible.
            
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
 
        `
    );

    try {
        const model = new ChatGoogleGenerativeAI({
            model: "gemini-2.5-flash",
            apiKey: process.env.GOOGLE_API_KEY,
            temperature: 0.1,
        });

        const combineDocsChain = await createStuffDocumentsChain({llm: model, prompt}); // document chain
        const retrieval = await createRetrievalChain({  // retrieval chain
            retriever: vectorStore.asRetriever(8),
            combineDocsChain
        });

        const query = "Generate a proper README.md file, strictly follow the prompt & use the given context only."

        const response = await retrieval.invoke({input: query});
        // console.log("Readme resposne: ", response.data);

        return res.status(200).json({
            answer: response.answer 
        })

    } catch (error) {
        console.log("Readme Error: ", error);
    }

}

module.exports = {
    generateReadme
};