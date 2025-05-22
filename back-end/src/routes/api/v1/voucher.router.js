const express = require('express');
const router = express.Router();
const { VoucherController } = require('../../../controllers/index');
const { AuthMiddleware } = require('../../../middlewares/index');


router.get('/get-vouchers-by-restaurantId/:restaurantId', AuthMiddleware.checkRoles(['GUEST', 'CUSTOMER', 'STAFF', 'MANAGER', 'ADMIN']), VoucherController.getVouchersByRestaurantId);
router.get('/get-vouchers-by-dishId/:dishId', AuthMiddleware.checkRoles(['GUEST', 'CUSTOMER', 'STAFF', 'MANAGER', 'ADMIN']), VoucherController.getVouchersByDishId);
router.get('/get-paginated-vouchers', AuthMiddleware.checkRoles(['GUEST', 'CUSTOMER', 'STAFF', 'MANAGER', 'ADMIN']), VoucherController.getPaginatedVouchers);
router.get('/get-all-valid-vouchers', AuthMiddleware.checkRoles(['GUEST', 'CUSTOMER', 'STAFF', 'MANAGER', 'ADMIN']), VoucherController.getAllValidVouchers);
router.get('/', AuthMiddleware.checkRoles(['GUEST', 'CUSTOMER', 'STAFF', 'MANAGER', 'ADMIN']), VoucherController.getAllVouchers);

/**
 * this router can be access by DEVELOPER rights
 */
router.post('/add-voucher-for-all', VoucherController.addVoucherForAll);

module.exports = router;
