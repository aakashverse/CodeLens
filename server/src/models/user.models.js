const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"]
    },
    email: {
        type: String,
        required: [true, "email is required"]
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    role: {
        enum: ["Student", "Employee"]
    },
    geminiApiKey: {
        type: String,
        default: null
    },
    aiModel: {
        type: String,
        default: 'gemini-2.5-flash'
    }
})

const userModel = mongoose.model("userModel", userSchema);

module.exports = userModel;