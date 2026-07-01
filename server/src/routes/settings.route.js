const {Router} = require("express");
const encryptionController = require("../controllers/settings.controller");
const {authUser} = require("../middlewares/auth.middleware");

const router = Router();

router.get("/settings", authUser, encryptionController.getSettingsStatus);

router.post("/settings", authUser, encryptionController.encryptKey);

module.exports = router;