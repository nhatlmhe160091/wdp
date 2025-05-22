const express = require('express');
const router = express.Router();
const { RestaurantController } = require('../../../controllers/index');
const { AuthMiddleware } = require('../../../middlewares/index');


router.get('/', AuthMiddleware.checkRoles(['GUEST', 'CUSTOMER', 'STAFF', 'MANAGER', 'ADMIN']), RestaurantController.getAllRestaurants);
router.get('/get-paginated-restaurants', AuthMiddleware.checkRoles(['GUEST', 'CUSTOMER', 'STAFF', 'MANAGER', 'ADMIN']), RestaurantController.getPaginatedRestaurants);
router.get('/get-restaurants-by-voucherId/:voucherId', AuthMiddleware.checkRoles(['GUEST', 'CUSTOMER', 'STAFF', 'MANAGER', 'ADMIN']), RestaurantController.getRestaurantsByVoucherId);
router.get('/get-restaurants-by-dishId/:dishId', AuthMiddleware.checkRoles(['GUEST', 'CUSTOMER', 'STAFF', 'MANAGER', 'ADMIN']), RestaurantController.getRestaurantsByDishId);
router.get('/get-restaurant/:id', AuthMiddleware.checkRoles(['GUEST', 'CUSTOMER', 'STAFF', 'MANAGER', 'ADMIN']), RestaurantController.getRestaurant);


router.get('/', RestaurantController.getAllRestaurantsNgocNB);
router.get('/paginatedRestaurants', RestaurantController.getPaginatedRestaurantsNgocNB);
router.post('/', RestaurantController.createRestaurant);
router.put('/:id', RestaurantController.updateRestaurant);
router.delete('/:id', RestaurantController.deleteRestaurant);
router.post('/:restaurantId/dish', RestaurantController.createDishForRestaurant);
router.put('/:restaurantId/dish/:dishId', RestaurantController.updateDishForRestaurant);
router.delete('/:restaurantId/dish/:dishId', RestaurantController.deleteDishForRestaurant);


module.exports = router;
