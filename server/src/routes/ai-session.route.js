const {Router} = require("express");
const AiSessionController = require("../controllers/ai-session.controller");
const {authUser} = require("../middlewares/auth.middleware");

const AiSessionRouter = Router();

AiSessionRouter.post('/connect', authUser, AiSessionController.initializeRepoSession);

AiSessionRouter.post('/chat', authUser, AiSessionController.chatWithCodebase);

AiSessionRouter.get('/check-status', authUser, AiSessionController.checkRepoStatus);

AiSessionController

module.exports = AiSessionRouter;
