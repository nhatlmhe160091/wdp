import api from './index'
import { handleApiCall } from '../utils/handleApi';

const ImageService = {
    getImage: async (id) => {
        return handleApiCall(() =>
            api.get(`image/get-image/${id}`)
        )
    }
}

export default ImageService;
