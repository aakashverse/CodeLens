const mongoose = require("mongoose");

async function ConnectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "codelens"
        });

        console.log("MongoDB connected");
        console.log("Database:", mongoose.connection.name);
    } catch (err) {
        console.log("error in connecting db:", err);
    }
}

module.exports = ConnectToDB;