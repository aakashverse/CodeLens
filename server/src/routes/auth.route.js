const {Router} = require("express")
const userModels = require("../models/user.models");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware")

const authRouter = Router();

// register
authRouter.post("/register", authController.registerController);

// login
authRouter.post("/login", authController.loginController);

// logout
authRouter.get("/logout", authController.logoutController);

// getme
authRouter.get("/me", authMiddleware.authUser, authController.getMeController);

module.exports = authRouter;
