require('dotenv').config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const ConnectToDB = require("./src/config/db");
const authRouter  = require("./src/routes/auth.route");
const workSpaceRouter  = require("./src/routes/workspace.route");
const readmeRouter = require("./src/routes/readme.route");

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

ConnectToDB();

app.use("/api/auth", authRouter);
app.use("/api/repo", workSpaceRouter);
app.use("/api/gen", readmeRouter);

app.get("/health", (req, res) => {  
    return res.status(201).json({
        message: "KYC is healthy :)"
    })
})

app.listen(process.env.PORT || 5000, () => {
    console.log(`app is listening on port ${process.env.PORT}..`);
});