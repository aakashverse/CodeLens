const {Router} = require("express");
const ragController = require("../controllers/rag.controller");

const ragRouter = Router();

ragRouter.post('/connect', ragController.initializeRepoSession);

ragRouter.post('/chat', ragController.chatWithCodebase);



module.exports = ragRouter;
