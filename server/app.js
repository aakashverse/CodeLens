const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const ConnectToDB = require("./src/config/db");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

ConnectToDB();

app.listen(process.env.PORT || 5000, () => {
    console.log(`app is listening on port ${process.env.PORT}..`);
});