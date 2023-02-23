const express = require("express");
const router = express.Router();
const KeshbekController = require("../controllers/Kashbek.route");
const auth = require("../middleware/auth.middleware");
const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");

router.get("/all", auth(), awaitHandlerFactory(KeshbekController.all));
router.post("/create", auth(), awaitHandlerFactory(KeshbekController.create));

module.exports = router;
