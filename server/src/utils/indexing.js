import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const dbName = "codelens";
const collectionName = "code_embeddings";

export async function indexCodebase(files, repoUrl) {
    const collection = client.db(dbName).collection(collectionName);
    
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1500,
        chunkOverlap: 200,
    });

    const documents = [];

    for (const file of files) {
        const chunks = await splitter.splitText(file.content);
        
        chunks.forEach((chunkText) => {
            documents.push({
                pageContent: chunkText,
                metadata: {
                    repoUrl: repoUrl, 
                    filePath: file.path,
                    language: file.language
                }
            }); 

        });
    }

    await MongoDBAtlasVectorSearch.fromDocuments(documents, embeddings, {
        collection: collection,
        indexName: "vector_index",
        textKey: "text",
        embeddingKey: "embedding",
    });

    console.log(`Successfully indexed ${documents.length} chunks for ${repoUrl}`);
}