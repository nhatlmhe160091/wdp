const express = require('express');
const router = express.Router();
const { DishController } = require('../../../controllers/index');
const { AuthMiddleware } = require('../../../middlewares/index');


router.get('/get-paginated-dishes', AuthMiddleware.checkRoles(['GUEST', 'CUSTOMER', 'STAFF', 'MANAGER', 'ADMIN']), DishController.getPaginatedDishes);
router.get('/get-dishes', AuthMiddleware.checkRoles(['GUEST', 'CUSTOMER', 'STAFF', 'MANAGER', 'ADMIN']), DishController.getDishes);
router.get('/get-dishes-by-voucherId', AuthMiddleware.checkRoles(['GUEST', 'CUSTOMER', 'STAFF', 'MANAGER', 'ADMIN']), DishController.getDishesByVoucherId);
router.get('/', AuthMiddleware.checkRoles(['GUEST', 'CUSTOMER', 'STAFF', 'MANAGER', 'ADMIN']), DishController.getAllDishes);

/**
 * this router can be access by DEVELOPER rights
 */
router.get('/dev-insert-all-dish-for-all-restaurant', DishController.insertAllDishForAllRestaurant);


router.get('/', DishController.getAllDishesNgocNB);
router.get('/paginatedDishes', DishController.getAllDishesNgocNB);
router.post('/', DishController.createDish);
router.put('/:id', DishController.updateDish);
router.delete('/:id', DishController.deleteDish);

module.exports = router;
