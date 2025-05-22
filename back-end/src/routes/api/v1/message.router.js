const express = require('express');
const router = express.Router();
const { MessageController } = require('../../../controllers/index');
const { AuthMiddleware } = require('../../../middlewares/index');


router.get('/', AuthMiddleware.checkRoles(['ADMIN']), MessageController.getAllMessages);

module.exports = router;
