const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const ConnectToDB = require("./src/config/db");
const authRouter = require("./src/routes/auth.route");

dotenv.config();
const app = express();


app.use(cors());
app.use(express.json());

ConnectToDB();

app.use("/api/auth", authRouter);

app.get("/health", (req, res) => {
    return res.status(201).json({
        message: "KYC is healthy :)"
    })
})

app.listen(process.env.PORT || 5000, () => {
    console.log(`app is listening on port ${process.env.PORT}..`);
});