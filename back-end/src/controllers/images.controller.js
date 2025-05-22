const { ImageService } = require('../services/index');

class ImageController {

  uploadImage = async (req, res, next) => {
    const { url, altText, entityId, entityType } = req.body;
    try {
      const image = await ImageService.createNewImage({ url, altText, entityId, entityType });
      res.status(200).json({
        data: image,
        message: "Image uploaded successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  getImagesByEntityId = async (req, res, next) => {
    const { entityId } = req.params;
    try {
      const images = await ImageService.getImagesByEntityId(entityId);
      res.status(200).json({
        data: images,
      });
    } catch (error) {
      next(error);
    }
  }

  deleteImage = async (req, res, next) => {
    const { imageId } = req.params;
    console.log("imageId: ", imageId);
    try {
      const image = await ImageService.getImageById(imageId);
      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }

      await ImageService.deleteImageById(imageId);
      res.status(200).json({
        message: "Image deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new ImageController();
