const express = require('express');
const router = express.Router();
const clientController = require('../controllers/ClientController');
const orderController = require('../controllers/order.controller');
const auth = require('../middleware/auth.middleware');
const authClient = require('../middleware/authclient.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');

// router.get('/all', auth(), awaitHandlerFactory(clientController.all));
router.post('/login', awaitHandlerFactory(clientController.login));
router.post('/sign', awaitHandlerFactory(clientController.singn));
router.get('/getUser', authClient(), awaitHandlerFactory(clientController.getUser));
router.patch('/update', authClient(), awaitHandlerFactory(clientController.update));
router.get('/order/again', authClient(), awaitHandlerFactory(orderController.againOrderClient));

module.exports = router;