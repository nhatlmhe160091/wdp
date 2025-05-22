const { Dish, Voucher, Restaurant } = require('../models/index');

class DishService {

    getAllDishes = async () => {
        const dishes = await Dish.find();
        const totalRecords = await Dish.countDocuments();
        return {
            data: dishes,
            meta: {
                total: totalRecords
            }
        };
    }

    getPaginatedDishes = async (page = 1, limit = 12, name, minPrice, maxPrice, category, foodTag) => {
        const skip = (page - 1) * limit;
        const filter = {};
        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }
        if (minPrice && Number(minPrice) >= 0) {
            filter.price = { ...filter.price, $gte: Number(minPrice) };
        }

        if (maxPrice && Number(maxPrice) >= 0) {
            filter.price = { ...filter.price, $lte: Number(maxPrice) };
        }
        if (category) {
            filter.category = category;
        }
        if (foodTag) {
            filter.foodTag = foodTag;
        }
        const records = await Dish.find(filter)
            .skip(skip)
            .limit(limit)
            .exec();
        const totalRecords = await Dish.countDocuments(filter);
        const totalPages = Math.ceil(totalRecords / limit);
        return {
            data: records,
            meta: {
                total: totalRecords,
                totalPages,
                currentPage: parseInt(page),
                perPage: parseInt(limit)
            }
        }
    }


    getDishes = async (restaurantId, name, minPrice, maxPrice, category, foodTag) => {
        const filter = {};
        if (restaurantId) {
            filter.restaurants = { $in: [restaurantId] };
        }
        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }
        if (minPrice) {
            filter.price = { $gte: minPrice };
        }
        if (maxPrice) {
            filter.price = { $lte: maxPrice };
        }
        if (category) {
            filter.category = category;
        }
        if (foodTag) {
            filter.foodTag = foodTag;
        }
        const records = await Dish.find(filter).exec();
        const totalRecords = await Dish.countDocuments(filter);
        return {
            data: records,
            meta: {
                total: totalRecords,
            }
        }
    }

    /**
    * author: XXX
    */
    getDishesByVoucherId = async (voucherId) => {
        const voucher = await Voucher.findById(voucherId)
            .populate({
                path: 'dishes',
            })
            .exec();
        if (!voucher) {
            throw new Error('Voucher not found');
        }

        return {
            data: voucher.dishes,
        }
    };

    /**
    * author: XXX
    */
    insertAllDishForAllRestaurant = async () => {
        const restaurants = await Restaurant.find().select('_id');
        const restaurantIds = restaurants.map(restaurant => restaurant._id);
        const updatedDishes = await Dish.updateMany(
            {},
            { $set: { restaurants: restaurantIds } },
            { multi: true, new: true }
        );

        return updatedDishes;
    };

    //----------------------------------------------------------------------------------

    /**
    * author: NgocNB
    */
    getAllDishesNgocNB = async () => {
        return await Dish.find()
            .populate('restaurants')
            .populate('images');
    }

    /**
    * author: NgocNB
    */
    countDishes = async () => {
        return await Dish.countDocuments();
    }

    /**
    * author: NgocNB
    */
    findDishesInPage = async (LIMIT, startIndex) => {
        return await Dish.find()
            .sort({ _id: -1 })
            .limit(LIMIT)
            .skip(startIndex)
            .populate('restaurants')
            .populate('images');
    }

    /**
    * author: NgocNB
    */
    createDish = async (dishData) => {
        const newDish = new Dish(dishData);
        return await newDish.save();
    }

    /**
    * author: NgocNB
    */
    updateDish = async (id, updatedData) => {
        const { restaurants, images, ...otherUpdatedData } = updatedData;

        const updatedDish = await Dish.findByIdAndUpdate(id, otherUpdatedData, { new: true });

        if (restaurants) {
            updatedDish.restaurants = restaurants;
        }
        if (images) {
            updatedDish.images = images;
        }

        return await updatedDish.save();
    }

    /**
    * author: NgocNB
    */
    addImageToDish = async (dishId, imageUrl, altText) => {
        const newImage = await Image.create({
            url: imageUrl,
            altText,
            entityId: dishId,
            entityType: 'DISH'
        });
        await Dish.findByIdAndUpdate(dishId, {
            $push: { images: newImage._id }
        });

        return newImage;
    }

    /**
    * author: NgocNB
    */
    deleteDish = async (id) => {
        return await Dish.findByIdAndDelete(id);
    }

    /**
    * author: NgocNB
    */
    getDishImages = async (dishId) => {
        return await Image.find({ entityId: dishId, entityType: 'DISH' });
    }

}

module.exports = new DishService;
