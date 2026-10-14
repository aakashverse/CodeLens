const mongoose = require("mongoose");

const CodeChunkSchema = new mongoose.Schema({
    repoName: {
        type: String,
        required: true,
        index: true
    },
    source: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    embedding: {
        type: [Number],
        required: true
    },
    indexedAt: {
        type: String
    },
    loc: {
        lines: {
            from: Number,
            to: Number
        }
    }
}, { 
    collection: "code_embeddings" // Force Mongoose to use the exact same collection as LangChain
});

module.exports = mongoose.model("CodeChunk", CodeChunkSchema);