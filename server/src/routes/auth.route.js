const userModels = require("../models/user.models");
const authController = require("../controllers/auth.controller");

const router = express.Router();

// register
router.post("/register", authController.registerController);

// login
router.post("/login", authController.loginController);
