const express = require("express");
const router = express.Router();
const activityController = require("../controllers/Agent.controller");
const auth = require("../middleware/auth.middleware");
const Role = require("../utils/userRoles.utils");
const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");
const joiMiddleware = require("../middleware/joi.middleware");

router.get("/all", auth(), awaitHandlerFactory(activityController.all));
router.get("/change/:id", auth(), awaitHandlerFactory(activityController.one));
router.post("/create", auth(), awaitHandlerFactory(activityController.create));
router.patch(
  "/update/:id",
  auth(),
  awaitHandlerFactory(activityController.update)
);
router.get(
  "/delete/:id",
  auth(),
  awaitHandlerFactory(activityController.delete)
);
router.post("/login", awaitHandlerFactory(activityController.login));

module.exports = router;
