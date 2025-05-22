const { Image } = require('../models/index');

class ImageService {
    getAllImages = async () => {
        return await Image.find();
    }

    /**
     * author: NgocNB
     */
    createNewImage = async (data) => {

        return await Image.create(data);
    }

    /**
     * author: NgocNB
     */
    getImagesByEntityId = async (entityId) => {
        return await Image.find({ entityId });
    }

    /**
     * author: NgocNB
     */
    getImageById = async (imageId) => {
        return await Image.findById(imageId);
    }

    /**
     * author: NgocNB
     */
    deleteImageById = async (imageId) => {
        return await Image.findByIdAndDelete(imageId);
    }

}

module.exports = new ImageService;
