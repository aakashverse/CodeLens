const { MongoClient } = require("mongodb");
const { MongoDBAtlasVectorSearch } = require("@langchain/mongodb");

const client = new MongoClient(process.env.MONGO_URI);
const dbName = "codelens";
const collectionName = "code_embeddings";

/**
 * Safely embed and index documents in batches to avoid Gemini rate limits (429)
 */
async function indexDocuments(documents, embeddings, batchSize = 25) {
    await client.connect();
    const collection = client.db(dbName).collection(collectionName);

    const textKey = "text";
    const embeddingKey = "embedding";

    for (let i = 0; i < documents.length; i += batchSize) {
        const batch = documents.slice(i, i + batchSize);
        const texts = batch.map(doc => doc.pageContent);

        let vectors = null;
        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts) {
            attempts++;
            try {
                vectors = await embeddings.embedDocuments(texts);
                // LangChain GoogleGenerativeAI returns empty arrays on failure/quota limit
                const hasEmpty = !vectors || vectors.length === 0 || vectors.some(v => !v || v.length === 0);
                if (hasEmpty) {
                    throw new Error("Received empty or missing embedding vector from provider (quota limit or timeout)");
                }
                break;
            } catch (err) {
                console.warn(`[Atlas RAG] Batch ${Math.floor(i / batchSize) + 1} attempt ${attempts} failed: ${err.message}. Retrying in ${2 * attempts}s...`);
                if (attempts >= maxAttempts) {
                    throw err;
                }
                await new Promise(resolve => setTimeout(resolve, 2000 * attempts));
            }
        }

        const docsToInsert = vectors.map((vec, idx) => ({
            [textKey]: batch[idx].pageContent,
            [embeddingKey]: vec,
            ...batch[idx].metadata
        }));

        await collection.insertMany(docsToInsert);
        console.log(`[Atlas RAG] Indexed ${Math.min(i + batchSize, documents.length)} / ${documents.length} chunks...`);

        // Small cooldown between batches to stay comfortably within rate limits
        if (i + batchSize < documents.length) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    return new MongoDBAtlasVectorSearch(embeddings, {
        collection: collection,
        indexName: "vector_index",
        textKey: textKey,
        embeddingKey: embeddingKey,
    });
}

/**
 * Connect to vector store or index new documents
 */
async function getVectorStore(embeddings, documents = null) {
    await client.connect();
    const collection = client.db(dbName).collection(collectionName);

    // If documents are passed (during indexing stage), upload them safely
    if (documents && documents.length > 0) {
        return await indexDocuments(documents, embeddings);
    }

    // Otherwise (during chat / RAG stage), connect to the existing store
    return new MongoDBAtlasVectorSearch(embeddings, {
        collection: collection,
        indexName: "vector_index",
        textKey: "text",
        embeddingKey: "embedding",
    });
}

module.exports = {
    getVectorStore,
    indexDocuments
};