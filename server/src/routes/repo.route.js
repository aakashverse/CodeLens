const {Router} = require("express");
const repoController = require("../controllers/repo.controller");
const {authUser} = require("../middlewares/auth.middleware");

const repoRouter = Router();

repoRouter.post('/connect', authUser, repoController.initializeRepoSession);

repoRouter.post('/chat', authUser, repoController.chatWithCodebase);

repoRouter.get('/check-status', authUser, repoController.checkRepoStatus);



module.exports = repoRouter;
