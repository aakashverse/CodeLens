const {Router} = require("express");
const readmeController = require("../controllers/readme.controller.js");

const readmeRouter = Router();


readmeRouter.get('/readme', readmeController.generateReadme);


module.exports = readmeRouter;