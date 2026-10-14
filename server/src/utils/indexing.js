const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const { indexDocuments } = require("./vectorStore");

async function indexCodebase(files, repoUrl, embeddings) {
    const repoName = repoUrl.split('/').pop().replace('.git', '');
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1500,
        chunkOverlap: 200,
    });

    const documents = [];

    for (const file of files) {
        if (!file.content || !file.content.trim()) continue;
        const chunks = await splitter.splitText(file.content);

        chunks.forEach((chunkText) => {
            documents.push({
                pageContent: chunkText,
                metadata: {
                    repoName: repoName,
                    source: file.path || file.filePath,
                    language: file.language,
                    indexedAt: new Date().toISOString()
                }
            });
        });
    }

    if (documents.length > 0) {
        await indexDocuments(documents, embeddings);
    }

    console.log(`Successfully indexed ${documents.length} chunks for ${repoUrl}`);
    return documents.length;
}

module.exports = {
    indexCodebase
};