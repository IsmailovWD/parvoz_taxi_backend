const express = require("express");
const router = express.Router();
const rateController = require("../controllers/rate.controller");
const auth = require("../middleware/auth.middleware");
const Role = require("../utils/userRoles.utils");
const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");
const joiMiddleware = require("../middleware/joi.middleware");

router.get("/all", awaitHandlerFactory(rateController.all));
router.get("/change/:id", auth(), awaitHandlerFactory(rateController.one));
router.post("/create", auth(), awaitHandlerFactory(rateController.create));
router.patch("/update/:id", awaitHandlerFactory(rateController.update));
// router.delete('/delete/:id', awaitHandlerFactory(activityController.delete));
// router.post('/login', awaitHandlerFactory(activityController.login));

module.exports = router;
