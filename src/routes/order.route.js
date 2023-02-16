const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const orderCompletedController = require("../controllers/completedOrder");
const auth = require("../middleware/auth.middleware");
const authClients = require("../middleware/authclient.middleware");
const authDriver = require("../middleware/authdriver.middleware");
const Role = require("../utils/userRoles.utils");
const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");
const joiMiddleware = require("../middleware/joi.middleware");

router.get("/all", auth(), awaitHandlerFactory(orderController.all));
router.post("/create", auth(), awaitHandlerFactory(orderController.create));
router.post(
  "/client/create",
  authClients(),
  awaitHandlerFactory(orderController.createClient)
);
router.patch(
  "/client/cancel",
  authClients(),
  awaitHandlerFactory(orderController.cancelOrderCreate)
);
router.get(
  "/get_current_order",
  authClients(),
  awaitHandlerFactory(orderController.one)
);

// order drivers

router.post(
  "/driver/cancel",
  authDriver(),
  awaitHandlerFactory(orderController.DriverOrderCancel)
);
///////// completed order

router.get(
  "/completed/all",
  auth(),
  awaitHandlerFactory(orderCompletedController.all)
);

module.exports = router;
