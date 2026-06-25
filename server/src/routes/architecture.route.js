const {Router} = require("express");
const architectureController = require("../controllers/architecture.controller");

const architectureRouter = Router();

architectureRouter.post("/architecture", architectureController.generateArchitecture);


module.exports = architectureRouter;