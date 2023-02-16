const express = require("express");
const router = express.Router();
const clientController = require("../controllers/Driver.controller");
const orderController = require("../controllers/order.controller");
const rateController = require("../controllers/rate.controller");
const auth = require("../middleware/auth.middleware");
const authDriver = require("../middleware/authdriver.middleware");
const Role = require("../utils/userRoles.utils");
const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");
const joiMiddleware = require("../middleware/joi.middleware");

// router.get('/all', auth(), awaitHandlerFactory(clientController.all));
// router.get('/check_phone', awaitHandlerFactory(clientController.login));
router.post("/sign", awaitHandlerFactory(clientController.singn));
router.get(
  "/getUser",
  authDriver(),
  awaitHandlerFactory(clientController.getUser)
);
router.patch(
  "/update",
  authDriver(),
  awaitHandlerFactory(clientController.update)
);
router.get(
  "/active",
  authDriver(),
  awaitHandlerFactory(clientController.active_driver)
);
router.post("/rating/add", awaitHandlerFactory(clientController.ratingCreate));
router.get("/all", awaitHandlerFactory(clientController.all));
router.post("/create", auth(), awaitHandlerFactory(clientController.create));
router.post(
  "/set_location",
  authDriver(),
  awaitHandlerFactory(clientController.setLocation)
);
router.get("/rate/all", awaitHandlerFactory(rateController.all));
router.get("/one/:id", awaitHandlerFactory(clientController.one));
// order drivers

router.get(
  "/order/all",
  authDriver(),
  awaitHandlerFactory(clientController.OrderAll)
);

// select order

router.post(
  "/order/select",
  authDriver(),
  awaitHandlerFactory(clientController.select_driver_order)
);

// get my order
router.get(
  "/get-my-order",
  authDriver(),
  awaitHandlerFactory(clientController.GetMyOrder)
);

//arrivalOrder
router.get(
  "/arrival-order",
  authDriver(),
  awaitHandlerFactory(clientController.arrivalOrder)
);

// start order
router.get(
  "/start-order",
  authDriver(),
  awaitHandlerFactory(clientController.startOrder)
);

// complete-order
router.post(
  "/complete-order",
  authDriver(),
  awaitHandlerFactory(clientController.completeOrder)
);

router.post(
  "/cancel",
  authDriver(),
  awaitHandlerFactory(orderController.DriverOrderCancel)
);

// order driver old

router.get(
  "/get-old-orders",
  authDriver(),
  awaitHandlerFactory(orderController.OneDriverOrders)
);
// empty driver

router.post(
  "/empty",
  authDriver(),
  awaitHandlerFactory(clientController.emptyDriver)
);
// driver information

router.get("/info", authDriver(), awaitHandlerFactory(clientController.info));

//
router.patch(
  "/active_admin/:id",
  auth(),
  awaitHandlerFactory(clientController.active_admin)
);

// get my waiting orders
router.get(
  "/get_my_waiting_order",
  authDriver(),
  awaitHandlerFactory(clientController.get_my_waiting_order)
);
//
router.get("/summa", awaitHandlerFactory(clientController.summa_add));

router.get(
  "/start-session",
  authDriver(),
  awaitHandlerFactory(clientController.start_session)
);

module.exports = router;
