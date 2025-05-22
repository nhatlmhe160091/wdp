import api from './index';
import { handleApiCall } from '../utils/handleApi';

const TableService = {
    getAllRestaurants: async () => {
        return handleApiCall(() =>
            api.get('/restaurant')
        )
    },

    getPaginatedRestaurants: async (filter) => {
        const { page, limit, name } = filter;
        return handleApiCall(() =>
            api.get('/restaurant/get-paginated-restaurants', {
                params: { page, limit, name }
            })
        )
    },

    getRestaurantsByVoucherId: async (voucherId) => {
        return handleApiCall(() =>
            api.get(`/restaurant/get-restaurants-by-voucherId/${voucherId}`)
        )
    },

    getRestaurantsByDishId: async (dishId) => {
        return handleApiCall(() =>
            api.get(`/restaurant/get-restaurants-by-dishId/${dishId}`)
        )
    },

    getRestaurant: async (restaurantId) => {
        return handleApiCall(() =>
            api.get(`/restaurant/get-restaurant/${restaurantId}`)
        )
    },

    getTables: async () => {
        return handleApiCall(() => api.get("/table"));
    },

    getPaginatedTables: async ( page = 1, limit = 10, search = '', restaurant = '') => {
        return handleApiCall(() =>
            api.get("/table/page-tables", {
                params: {
                    page,
                    limit,
                    search,
                    restaurant
                }
            })
        );
    },

    createTable: async ( table) => {
        return handleApiCall(() => api.post("/table/create-table", table));
    },

    updateTable: async ( table) => {
        return handleApiCall(() =>
            api.put(`/table/update-table/${table._id}`, table)
        );
    },

    deleteTable: async ( tableId) => {
        return handleApiCall(() =>
            api.delete(`/table/delete-table/${tableId}`)
        );
    }

};

export default TableService;
