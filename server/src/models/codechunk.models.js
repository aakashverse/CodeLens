const mongoose = require("mongoose");

const CodeChunkSchema = new mongoose.Schema({
    repoUrl: {
        type: String,
        required: [true, 'repo url is required']
    },
    filePath: {
        type: String,
        required: [true, 'repo path is required']
    },
    fileName: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: [true, 'content is required']
    },
    embedding: {
        type: [Number],
        required: [true, 'embeddings are required']
    } 
}, {timestamps: true}
)

const CodeChunk = mongoose.model('CodeChunk', CodeChunkSchema);

module.exports = CodeChunk