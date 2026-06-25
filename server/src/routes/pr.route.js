const {Router} = require("express");
const prController = require("../controllers/pr.controller");

const prRouter = Router();

prRouter.post('/analyze', prController.analyzePR);

module.exports = prRouter;