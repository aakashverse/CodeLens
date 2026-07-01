const {Router} = require("express");
const readmeController = require("../controllers/readme.controller.js");
const {authUser} = require("../middlewares/auth.middleware");

const readmeRouter = Router();


readmeRouter.post('/readme', authUser, readmeController.generateReadme);


module.exports = readmeRouter;