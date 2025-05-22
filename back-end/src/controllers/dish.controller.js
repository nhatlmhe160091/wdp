const { DishService } = require('../services/index');
class DishController {
    /**
    * method: GET
    * router(/api/v1/dish)
    * author: XXX
    */
    getAllDishes = async (req, res, next) => {
        try {
            const dishes = await DishService.getAllDishes();
            res.status(200).json(dishes);
        } catch (error) {
            next(error);
        }
    }

    /**
    * method: GET
    * router(/api/v1/dish/get-paginated-dishes)
    * author: XXX
    */
    getPaginatedDishes = async (req, res, next) => {
        try {
            const { page, limit, name, minPrice, maxPrice, category, foodTag } = req.query;
            const resData = await DishService.getPaginatedDishes(page, limit, name, minPrice, maxPrice, category, foodTag);
            res.status(200).json(resData);
        } catch (error) {
            next(error);
        }
    }

    /**
    * method: GET
    * router(/api/v1/dish/get-dishes)
    * author: XXX
    */
    getDishes = async (req, res, next) => {
        try {
            const { restaurantId, name, minPrice, maxPrice, category, foodTag } = req.query;
            const resData = await DishService.getDishes(restaurantId, name, minPrice, maxPrice, category, foodTag);
            res.status(200).json(resData);
        } catch (error) {
            next(error);
        }
    }

    /**
    * method: GET
    * router(/api/v1/dish/get-dishes-by-voucherId)
    * author: XXX
    */
    getDishesByVoucherId = async (req, res, next) => {
        try {
            const { voucherId } = req.query;
            const resData = await DishService.getDishesByVoucherId(voucherId);
            res.status(200).json(resData);
        } catch (error) {
            next(error);
        }
    }

    /**
    * method: GET
    * router(/api/v1/dish/dev-insert-all-dish-for-all-restaurant)
    * author: XXX
    */
    insertAllDishForAllRestaurant = async (req, res, next) => {
        try {
            const resData = await DishService.insertAllDishForAllRestaurant();
            res.status(200).json(resData);
        } catch (error) {
            next(error);
        }
    }

    /**
      * method: GET
      * router(/api/v1/dish)
      * author: NgocNB
      */
    getAllDishesNgocNB = async (req, res, next) => {
        try {
            const dishes = await DishService.getAllDishesNgocNB();
            res.status(200).json({
                data: dishes,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * method: GET
     * router(/api/v1/dish/paginated)
     * author: NgocNB
     */
    getPaginatedDishesNgocNB = async (req, res, next) => {
        const { page = 1 } = req.query; // Mặc định trang là 1 nếu không có trang nào được gửi
        try {
            const LIMIT = 10; // Số món ăn trên mỗi trang
            const startIndex = (Number(page) - 1) * LIMIT; // Tính toán vị trí bắt đầu
            const total = await DishService.countDishes(); // Tổng số món ăn
            const dishes = await DishService.findDishesInPage(LIMIT, startIndex); // Lấy danh sách món ăn cho trang hiện tại

            res.status(200).json({
                data: dishes,
                currentPage: Number(page),
                numberOfPage: Math.ceil(total / LIMIT), // Tính tổng số trang
            });
        } catch (error) {
            res.status(401).json({ message: error?.message });
        }
    }

    /**
     * method: POST
     * router(/api/v1/dish)
     * author: NgocNB
     */
    createDish = async (req, res, next) => {
        try {
            const newDish = req.body; // Dữ liệu món ăn từ client
            const createdDish = await DishService.createDish(newDish); // Tạo món ăn mới
            res.status(201).json({
                message: "Dish created successfully",
                data: createdDish,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * method: PUT
     * router(/api/v1/dish/:id)
     * author: NgocNB
     */
    updateDish = async (req, res, next) => {
        const { id } = req.params; // Lấy id món ăn từ URL params
        const updatedDishData = req.body; // Dữ liệu cập nhật từ client

        try {
            const updatedDish = await DishService.updateDish(id, updatedDishData); // Cập nhật món ăn

            if (!updatedDish) {
                return res.status(404).json({ message: "Dish not found" });
            }

            res.status(200).json({
                message: "Dish updated successfully",
                data: updatedDish,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * method: DELETE
     * router(/api/v1/dish/:id)
     * author: NgocNB
     */
    deleteDish = async (req, res, next) => {
        const { id } = req.params; // Lấy id món ăn từ URL params
        try {
            const deletedDish = await DishService.deleteDish(id); // Xóa món ăn
            if (!deletedDish) {
                return res.status(404).json({ message: "Dish not found" });
            }
            res.status(200).json({
                message: "Dish deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new DishController();
