import api from './index'

const RestaurantService = {

    getPaginatedRestaurants: async (filter) => {
        const { page, limit, name } = filter;
        const res = await api.get('/restaurant/get-paginated-restaurants', {
            params: { page, limit, name }
        });
        return res.data;
    },

    getRestaurantsByVoucherId: async (voucherId) => {
        const res = await api.get(`/restaurant/get-restaurants-by-voucherId/${voucherId}`);
        return res.data;
    },

    getRestaurantsByDishId: async (dishId) => {
        const res = await api.get(`/restaurant/get-restaurants-by-dishId/${dishId}`);
        return res.data;
    },

    getRestaurant: async (restaurantId) => {
        const res = await api.get(`/restaurant/get-restaurant/${restaurantId}`);
        return res.data;
    },
    getAllRestaurants: async () => {
        const res = await api.get('/restaurant');
        return res.data;
    }
}

export default RestaurantService;
