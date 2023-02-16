const express = require('express');
const router = express.Router();
const CustomLocationController = require('../controllers/customLocation.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');

router.get('/all', awaitHandlerFactory(CustomLocationController.all));
router.post('/create', awaitHandlerFactory(CustomLocationController.create));
router.patch('/update', awaitHandlerFactory(CustomLocationController.update));
router.get('/filter', awaitHandlerFactory(CustomLocationController.filter));

module.exports = router;