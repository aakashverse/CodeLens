const {Router} = require("express");
const workSpaceController = require("../controllers/workspace.controller");

const workSpaceRouter = Router();

workSpaceRouter.post('/connect', workSpaceController.initializeRepoSession);

workSpaceRouter.post('/chat', workSpaceController.chatWithCodebase);



module.exports = workSpaceRouter;
