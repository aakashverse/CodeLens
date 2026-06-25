const {Router} = require("express");
const analyzerController = require("../controllers/analyzer.controller");

const analyzeRouter = Router();


analyzeRouter.post("/code", analyzerController.AnalyzeCode);

module.exports = analyzeRouter;