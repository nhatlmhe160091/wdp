const express = require('express');
const router = express.Router();
const { AuthMiddleware } = require('../../../middlewares/index');
const imagesController = require('../../../controllers/images.controller');
/**
 * author: NgocNB
 */
router.get('/get-image/:entityId', imagesController.getImagesByEntityId);
router.post('/upload-image', imagesController.uploadImage);
router.delete('/delete-image/:imageId', imagesController.deleteImage);

module.exports = router;