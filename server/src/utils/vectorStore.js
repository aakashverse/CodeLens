// let vectorStore = null;

// function setVectorStore(store) {
//   vectorStore = store;
// }

// function getVectorStore() {
//   return vectorStore;
// }

// module.exports = { setVectorStore, getVectorStore };


const { MongoClient } = require("mongodb");
const { MongoDBAtlasVectorSearch }  = require("@langchain/mongodb");
const { GoogleGenerativeAIEmbeddings }  = require("@langchain/google-genai");

// Initialize the MongoDB Client
const client = new MongoClient(process.env.MONGO_URI);

// getvector fxn.
async function getVectorStore(embeddings, documents = null) {
    const dbName = "codelens"; // Ensure dbName is defined here or globally
    const collectionName = "code_embeddings";

    await client.connect();
    const collection = client.db(dbName).collection(collectionName);
    
    // If documents are passed (during indexing stage), upload them
    if (documents && documents.length > 0) {
        return await MongoDBAtlasVectorSearch.fromDocuments(documents, embeddings, {
            collection: collection,
            indexName: "vector_index",
            textKey: "text",
            embeddingKey: "embedding",
        });
    }

    // Otherwise (during chat stage), just connect to the existing store
    return new MongoDBAtlasVectorSearch(embeddings, {
        collection: collection,
        indexName: "vector_index", 
        textKey: "text", 
        embeddingKey: "embedding",
    });
}

module.exports = {getVectorStore};