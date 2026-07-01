const {Router} = require("express");
const prController = require("../controllers/pr.controller");
const {authUser} = require("../middlewares/auth.middleware");

const prRouter = Router();

prRouter.post('/analyze', authUser, prController.analyzePR);

module.exports = prRouter;