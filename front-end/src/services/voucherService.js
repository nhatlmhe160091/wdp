import api from './index'
import { handleApiCall } from '../utils/handleApi';

const VoucherService = {

    getAllValidVouchers: async () => {
        return handleApiCall(() =>
            api.get('/voucher/get-all-valid-vouchers')
        )
    },

    getPaginatedVouchers: async (filter) => {
        const { page, limit, code } = filter;
        return handleApiCall(() =>
            api.get('/voucher/get-paginated-vouchers', {
                params: { page, limit, code }
            })
        )
    },

    getVouchersByDishId: async (dishId) => {
        return handleApiCall(() =>
            api.get(`/voucher/get-vouchers-by-dishId/${dishId}`)
        )
    },

    getVouchersByRestaurantId: async (restaurantId) => {
        return handleApiCall(() =>
            api.get(`/voucher/get-vouchers-by-restaurantId/${restaurantId}`)
        )
    }
}

export default VoucherService;
