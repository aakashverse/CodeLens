const {Router} = require("express");
const analyzerController = require("../controllers/analyzer.controller");

const analyzeRouter = Router();


analyzeRouter.get("/code", analyzerController.AnalyzeCode);

module.exports = analyzeRouter;