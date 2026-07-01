const {Router} = require("express");
const architectureController = require("../controllers/architecture.controller");
const {authUser} = require("../middlewares/auth.middleware");

const architectureRouter = Router();

architectureRouter.post("/architecture", authUser, architectureController.generateArchitecture);


module.exports = architectureRouter;