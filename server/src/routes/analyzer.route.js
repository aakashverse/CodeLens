const {Router} = require("express");
const analyzerController = require("../controllers/analyzer.controller");
const {authUser} = require("../middlewares/auth.middleware");

const analyzeRouter = Router();


analyzeRouter.post("/code", authUser, analyzerController.AnalyzeCode);

module.exports = analyzeRouter;