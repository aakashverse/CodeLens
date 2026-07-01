require('dotenv').config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const crypto = require('crypto');
const ConnectToDB = require("./src/config/db");
const authRouter  = require("./src/routes/auth.route");
const AiSessionRouter  = require("./src/routes/ai-session.route");
const readmeRouter = require("./src/routes/readme.route");
const architectureRouter = require("./src/routes/architecture.route");
const analyzeRouter = require("./src/routes/analyzer.route");
const prRouter = require("./src/routes/pr.route");
const encryptionRouter = require("./src/routes/settings.route");

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

ConnectToDB();

app.use(cookieParser());
app.use(express.json());


app.use("/api/auth", authRouter);
app.use("/api/repo", AiSessionRouter);
app.use("/api/gen", readmeRouter);
app.use("/api/visualize", architectureRouter);
app.use("/api/analyze", analyzeRouter);
app.use("/api/pr", prRouter);
app.use("/api/user", encryptionRouter);

app.get("/health", (req, res) => {  
    return res.status(201).json({
        message: "CodeLens is healthy :)"
    })
})

app.listen(process.env.PORT || 5000, () => {
    console.log(`app is listening on port ${process.env.PORT}..`);
});