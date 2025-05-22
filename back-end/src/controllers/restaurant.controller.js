const { RestaurantService, DishService } = require('../services/index');

class RestaurantController {
    /**
        * method: GET
        * router(api/v1/restaurant)
        * author: XXX
        */
    getAllRestaurants = async (req, res, next) => {
        try {
            const restaurants = await RestaurantService.getAllRestaurants();
            res.status(200).json(restaurants);
        } catch (error) {
            next(error);
        }
    }

    /**
    * method: GET
    * router(api/v1/get-paginated-restaurants)
    * author: XXX
    */
    getPaginatedRestaurants = async (req, res, next) => {
        try {
            const { page, limit, name } = req.query;
            const restaurants = await RestaurantService.getPaginatedRestaurants(page, limit, name);
            res.status(200).json(restaurants);
        } catch (error) {
            next(error);
        }
    }

    /**
    * method: GET
    * router(/api/v1/dish/get-restaurants-by-voucherId)
    */
    getRestaurantsByVoucherId = async (req, res, next) => {
        try {
            const { voucherId } = req.params;
            const resData = await RestaurantService.getRestaurantsByVoucherId(voucherId);
            res.status(200).json(resData);
        } catch (error) {
            next(error);
        }
    }

    /**
    * method: GET
    * router(/api/v1/dish/get-restaurants-by-dishId)
    */
    getRestaurantsByDishId = async (req, res, next) => {
        try {
            const { dishId } = req.params;
            const resData = await RestaurantService.getRestaurantsByDishId(dishId);
            res.status(200).json(resData);
        } catch (error) {
            next(error);
        }
    }

    /**
    * method: GET
    * router(/api/v1/dish/get-restaurant/:id)
    */
    getRestaurant = async (req, res, next) => {
        try {
            const { id } = req.params;
            const resData = await RestaurantService.getRestaurant(id);
            res.status(200).json(resData);
        } catch (error) {
            next(error);
        }
    }

    /**
     * method: GET
     * router(/api/v1/restaurant
     * author: NgocNB
     */
    getAllRestaurantsNgocNB = async (req, res, next) => {
        try {
            const restaurants = await RestaurantService.getAllRestaurantsNgocNB();
            res.status(200).json({
                data: restaurants,
            });
        } catch (error) {
            next(error);
        }
    }

    // author: NgocNB
    getPaginatedRestaurantsNgocNB = async (req, res, next) => {
        const { page } = req.query;
        try {
            const LIMIT = 5;
            const startIndex = (Number(page) - 1) * LIMIT;
            const total = await RestaurantService.countRestaurants();
            const restaurants = await RestaurantService.findRestaurantsInPage(LIMIT, startIndex);

            res.status(200).json({
                data: restaurants,
                currentPage: Number(page),
                numberOfPage: Math.ceil(total / LIMIT),
            });
        } catch (error) {
            res.status(401).json({ message: error?.message });
        }
    }

    // Thêm nhà hàng mới
    // author: NgocNB
    createRestaurant = async (req, res, next) => {
        try {
            const newRestaurant = req.body;
            const createdRestaurant = await RestaurantService.createRestaurant(newRestaurant);
            res.status(201).json({
                message: "Restaurant created successfully",
                data: createdRestaurant,
            });
        } catch (error) {
            next(error);
        }
    }

    // Cập nhật nhà hàng
    // author: NgocNB
    updateRestaurant = async (req, res, next) => {
        const { id } = req.params;
        const updatedRestaurantData = req.body;
        try {
            const updatedRestaurant = await RestaurantService.updateRestaurant(id, updatedRestaurantData);
            if (!updatedRestaurant) {
                return res.status(404).json({ message: "Restaurant not found" });
            }
            res.status(200).json({
                message: "Restaurant updated successfully",
                data: updatedRestaurant,
            });
        } catch (error) {
            next(error);
        }
    }

    // Xóa nhà hàng
    // author: NgocNB

    deleteRestaurant = async (req, res, next) => {
        const { id } = req.params;
        try {
            const deletedRestaurant = await RestaurantService.deleteRestaurant(id);
            if (!deletedRestaurant) {
                return res.status(404).json({ message: "Restaurant not found" });
            }
            res.status(200).json({
                message: "Restaurant deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    }

    // Thêm món ăn vào nhà hàng
    // author: NgocNB
    createDishForRestaurant = async (req, res, next) => {
        const { restaurantId } = req.params;
        const newDish = req.body;
        try {
            const restaurant = await RestaurantService.getRestaurantById(restaurantId);
            if (!restaurant) {
                return res.status(404).json({ message: "Restaurant not found" });
            }

            const createdDish = await DishService.createDish(newDish);
            restaurant.dishes.push(createdDish._id); // Thêm món ăn vào danh sách món của nhà hàng
            await restaurant.save();

            res.status(201).json({
                message: "Dish added to restaurant successfully",
                data: createdDish,
            });
        } catch (error) {
            next(error);
        }
    }

    // Cập nhật món ăn của nhà hàng
    // author: NgocNB

    updateDishForRestaurant = async (req, res, next) => {
        const { restaurantId, dishId } = req.params;
        const updatedDishData = req.body;
        try {
            const restaurant = await RestaurantService.getRestaurantById(restaurantId);
            if (!restaurant || !restaurant.dishes.includes(dishId)) {
                return res.status(404).json({ message: "Restaurant or Dish not found" });
            }

            const updatedDish = await DishService.updateDish(dishId, updatedDishData);
            res.status(200).json({
                message: "Dish updated successfully",
                data: updatedDish,
            });
        } catch (error) {
            next(error);
        }
    }

    // Xóa món ăn khỏi nhà hàng
    // author: NgocNB
    deleteDishForRestaurant = async (req, res, next) => {
        const { restaurantId, dishId } = req.params;
        try {
            const restaurant = await RestaurantService.getRestaurantById(restaurantId);
            if (!restaurant || !restaurant.dishes.includes(dishId)) {
                return res.status(404).json({ message: "Restaurant or Dish not found" });
            }

            await DishService.deleteDish(dishId);
            restaurant.dishes = restaurant.dishes.filter(dish => dish.toString() !== dishId); // Xóa món ăn khỏi danh sách món của nhà hàng
            await restaurant.save();

            res.status(200).json({
                message: "Dish deleted from restaurant successfully",
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new RestaurantController();
