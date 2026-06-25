const {Router} = require("express");
const repoController = require("../controllers/repo.controller");

const repoRouter = Router();

repoRouter.post('/connect', repoController.initializeRepoSession);

repoRouter.post('/chat', repoController.chatWithCodebase);

repoRouter.get('/check-status', repoController.checkRepoStatus);



module.exports = repoRouter;
