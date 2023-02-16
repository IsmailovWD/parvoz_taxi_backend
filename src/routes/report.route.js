const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller");
const auth = require("../middleware/auth.middleware");
const Role = require("../utils/userRoles.utils");
const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");
const joiMiddleware = require("../middleware/joi.middleware");

router.get(
  "/driver_rating",
  auth(),
  awaitHandlerFactory(reportController.driver_rating)
);
module.exports = router;
