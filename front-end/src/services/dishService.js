import api from './index'
import { handleApiCall } from '../utils/handleApi';

const DishService = {

    getAllDishes: async () => {
        return handleApiCall(() =>
            api.get('/dish')
        )
    },

    getPaginatedDishes: async (filter) => {
        const { page, limit, name, minPrice, maxPrice, category, foodTag } = filter;
        return handleApiCall(() =>
            api.get('/dish/get-paginated-dishes', {
                params: { page, limit, name, minPrice, maxPrice, category, foodTag }
            })
        )
    },

    getDishes: async (filter) => {
        const { restaurantId, name, minPrice, maxPrice, category, foodTag } = filter;
        return handleApiCall(() =>
            api.get('/dish/get-dishes', {
                params: { restaurantId, name, minPrice, maxPrice, category, foodTag }
            })
        )
    },

    getDishesByVoucherId: async (voucherId) => {
        return handleApiCall(() =>
            api.get('/dish/get-dishes-by-voucherId', {
                params: { voucherId }
            })
        )
    }
}

export default DishService;
