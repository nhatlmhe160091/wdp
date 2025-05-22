const { Voucher } = require('../models/index');
const { format } = require('date-fns');
class VoucherService {
    /**
   * author: XXX
   */
    getAllVouchers = async () => {
        const vouchers = await Voucher.find();
        const totalRecords = await Voucher.countDocuments();
        return {
            data: vouchers,
            meta: {
                total: totalRecords
            }
        };
    }

    /**
    * author: XXX
    */
    getAllValidVouchers = async () => {
        const currentDate = new Date();
        const filter = { validTo: { $gt: currentDate } };

        const vouchers = await Voucher.find(filter).lean();

        const totalRecords = await Voucher.countDocuments(filter);

        const vouchersWithStatus = vouchers.map(voucher => {
            const formattedValidFrom = format(new Date(voucher.validFrom), 'dd/MM/yyyy');
            const formattedValidTo = format(new Date(voucher.validTo), 'dd/MM/yyyy');
            return {
                ...voucher,
                validFrom: formattedValidFrom,
                validTo: formattedValidTo,
                status: 'valid'
            };
        });
        return {
            data: vouchersWithStatus,
            meta: {
                total: totalRecords
            }
        };
    };

    /**
    * author: XXX
    */
    getValidPaginatedVouchers = async (page = 1, limit = 10, code) => {
        const skip = (page - 1) * limit;
        const currentDate = new Date();
        const filter = { validTo: { $gt: currentDate } };

        if (code) {
            filter.code = { $regex: code, $options: 'i' };
        }

        const vouchers = await Voucher.find(filter)
            .skip(skip)
            .limit(limit)
            .lean();

        const totalRecords = await Voucher.countDocuments(filter);

        const vouchersWithStatus = vouchers.map(voucher => {
            const formattedValidFrom = format(new Date(voucher.validFrom), 'dd/MM/yyyy');
            const formattedValidTo = format(new Date(voucher.validTo), 'dd/MM/yyyy');
            return {
                ...voucher,
                validFrom: formattedValidFrom,
                validTo: formattedValidTo,
                status: 'valid'
            };
        });

        const totalPages = Math.ceil(totalRecords / limit);

        return {
            data: vouchersWithStatus,
            meta: {
                total: totalRecords,
                totalPages,
                currentPage: parseInt(page),
                perPage: parseInt(limit)
            }
        };
    };

    /**
    * author: XXX
    */
    getPaginatedVouchers = async (page = 1, limit = 10, code) => {
        const skip = (page - 1) * limit;
        const filter = {};
        if (code) {
            filter.code = { $regex: code, $options: 'i' };
        }
        const vouchers = await Voucher.find(filter)
            .skip(skip)
            .limit(limit)
            .lean();

        const totalRecords = await Voucher.countDocuments(filter);

        const currentDate = new Date();
        const vouchersWithStatus = vouchers.map(voucher => {
            const status = currentDate > voucher.validTo ? 'expired' : 'valid';
            const formattedValidFrom = format(new Date(voucher.validFrom), 'dd/MM/yyyy');
            const formattedValidTo = format(new Date(voucher.validTo), 'dd/MM/yyyy');
            return {
                ...voucher,
                validFrom: formattedValidFrom,
                validTo: formattedValidTo,
                status
            };
        });
        const totalPages = Math.ceil(totalRecords / limit);

        return {
            data: vouchersWithStatus,
            meta: {
                total: totalRecords,
                totalPages,
                currentPage: parseInt(page),
                perPage: parseInt(limit)
            }
        };
    };

    /**
    * author: XXX
    */
    addVoucherForAll = async (code, discountPercentage, validFrom, validTo, pointsRequired, description) => {
        const restaurants = await Restaurant.find();
        const dishes = await Dish.find();

        const newVoucher = new Voucher({
            code,
            discountPercentage,
            validFrom,
            validTo,
            pointsRequired,
            description,
            restaurants: restaurants.map(restaurant => restaurant._id),
            dishes: dishes.map(dish => dish._id)
        });

        await newVoucher.save();
        return newVoucher;
    };

    /**
    * author: XXX
    */
    getVouchersByDishId = async (dishId) => {
        const vouchers = await Voucher.find({ dishes: { $in: [dishId] } })
            .populate('restaurants')
            .populate('dishes')
            .lean();
        const currentDate = new Date();
        const vouchersWithStatus = vouchers.map(voucher => {
            const status = currentDate > voucher.validTo ? 'expired' : 'valid';
            const formattedValidFrom = format(new Date(voucher.validFrom), 'dd/MM/yyyy');
            const formattedValidTo = format(new Date(voucher.validTo), 'dd/MM/yyyy');
            return {
                ...voucher,
                validFrom: formattedValidFrom,
                validTo: formattedValidTo,
                status
            };
        });
        return {
            data: vouchersWithStatus,
        }
    };

    /**
    * author: XXX
    */
    getVouchersByRestaurantId = async (restaurantId) => {
        const vouchers = await Voucher.find({ restaurants: { $in: [restaurantId] } })
            .populate('restaurants')
            .populate('dishes')
            .lean();
        const currentDate = new Date();
        const vouchersWithStatus = vouchers.map(voucher => {
            const status = currentDate > voucher.validTo ? 'expired' : 'valid';
            const formattedValidFrom = format(new Date(voucher.validFrom), 'dd/MM/yyyy');
            const formattedValidTo = format(new Date(voucher.validTo), 'dd/MM/yyyy');
            return {
                ...voucher,
                validFrom: formattedValidFrom,
                validTo: formattedValidTo,
                status
            };
        });
        return {
            data: vouchersWithStatus,
        }
    };

    /**
    * author: NgocNB
    */
    getAllVouchersNgocNB = async () => {
        return await Voucher.find()
            .populate('dishes')
            .populate('restaurants');
    }

    /**
    * author: NgocNB
    */
    countVouchers = async () => {
        return await Voucher.countDocuments();
    }

    /**
    * author: NgocNB
    */
    findVouchersInPage = async (LIMIT, startIndex) => {
        return await Voucher.find()
            .sort({ _id: -1 })
            .limit(LIMIT)
            .skip(startIndex)
            .populate('dishes')
            .populate('restaurants');
    }

    /**
    * author: NgocNB
    */
    createVoucher = async (voucherData) => {
        const newVoucher = new Voucher(voucherData);
        return await newVoucher.save();
    }

    /**
    * author: NgocNB
    */
    updateVoucher = async (id, updatedData) => {
        const { dishes, restaurants, ...otherUpdatedData } = updatedData;


        const updatedVoucher = await Voucher.findByIdAndUpdate(id, otherUpdatedData, { new: true });

        if (dishes) {
            updatedVoucher.dishes = dishes;
        }

        if (restaurants) {
            updatedVoucher.restaurants = restaurants;
        }

        return await updatedVoucher.save();
    }

    /**
    * author: NgocNB
    */
    deleteVoucher = async (id) => {
        return await Voucher.findByIdAndDelete(id);
    }

    /**
    * author: NgocNB
    */
    getPaginatedVouchersNgocNB = async (page = 1, limit = 10) => {
        const skip = (page - 1) * limit;

        const vouchers = await Voucher.find()
            .skip(skip)
            .limit(limit)
            .lean();

        const totalRecords = await Voucher.countDocuments();

        const currentDate = new Date();
        const vouchersWithStatus = vouchers.map(voucher => {
            const status = currentDate > voucher.validTo ? 'expired' : 'valid';
            const formattedValidFrom = format(new Date(voucher.validFrom), 'dd/MM/yyyy');
            const formattedValidTo = format(new Date(voucher.validTo), 'dd/MM/yyyy');
            return {
                ...voucher,
                validFrom: formattedValidFrom,
                validTo: formattedValidTo,
                status
            };
        });
        const totalPages = Math.ceil(totalRecords / limit);

        return {
            data: vouchersWithStatus,
            meta: {
                total: totalRecords,
                totalPages,
                currentPage: parseInt(page),
                perPage: parseInt(limit)
            }
        };
    }

    /**
    * author: NgocNB
    */
    addVoucherForAll = async (code, discountPercentage, validFrom, validTo, pointsRequired, description) => {
        const restaurants = await Restaurant.find();
        const dishes = await Dish.find();

        const newVoucher = new Voucher({
            code,
            discountPercentage,
            validFrom,
            validTo,
            pointsRequired,
            description,
            restaurants: restaurants.map(restaurant => restaurant._id),
            dishes: dishes.map(dish => dish._id)
        });

        await newVoucher.save();
        return newVoucher;
    }

}

module.exports = new VoucherService();
