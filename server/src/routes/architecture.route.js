const {Router} = require("express");
const architectureController = require("../controllers/architecture.controller");

const architectureRouter = Router();

architectureRouter.get("/architecture", architectureController.generateArchitecture);


module.exports = architectureRouter;