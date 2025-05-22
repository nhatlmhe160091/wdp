const { VoucherService } = require('../services/index');
class VoucherController {
    /**
    * method: GET
    * router(api/v1/voucher)
    * author: XXX
    */
    getAllVouchers = async (req, res, next) => {
        try {
            const vouchers = await VoucherService.getAllVouchers();
            res.status(200).json(vouchers);
        } catch (error) {
            next(error);
        }
    }

    /**
    * method: GET
    * router(api/v1/voucher/get-all-valid-vouchers)
    * author: XXX
    */
    getAllValidVouchers = async (req, res, next) => {
        try {
            const vouchers = await VoucherService.getAllValidVouchers();
            res.status(200).json(vouchers);
        } catch (error) {
            next(error);
        }
    }


    /**
    * method: GET
    * router(api/v1/get-paginated-vouchers)
    * author: XXX
    */
    getPaginatedVouchers = async (req, res, next) => {
        try {
            const { page, limit, code } = req.query;
            const vouchers = await VoucherService.getPaginatedVouchers(page, limit, code);
            res.status(200).json(vouchers);
        } catch (error) {
            next(error);
        }
    }

    /**
    * method: POST
    * router(api/v1/voucher/add-voucher-for-all)
    * author: XXX
    */
    addVoucherForAll = async (req, res, next) => {
        try {
            const { code, discountPercentage, validFrom, validTo, pointsRequired, description } = req.body;
            const vouchers = await VoucherService.addVoucherForAll(code, discountPercentage, validFrom, validTo, pointsRequired, description);
            res.status(200).json({
                data: vouchers,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
    * method: GET
    * router(/api/v1/dish/get-vouchers-by-dishId)
    * author: XXX
    */
    getVouchersByDishId = async (req, res, next) => {
        try {
            const { dishId } = req.params;
            const resData = await VoucherService.getVouchersByDishId(dishId);
            res.status(200).json(resData);
        } catch (error) {
            next(error);
        }
    }

    /**
    * method: GET
    * router(/api/v1/dish/get-vouchers-by-restaurantId)
    * author: XXX
    */
    getVouchersByRestaurantId = async (req, res, next) => {
        try {
            const { restaurantId } = req.params;
            const resData = await VoucherService.getVouchersByRestaurantId(restaurantId);
            res.status(200).json(resData);
        } catch (error) {
            next(error);
        }
    }


    /**
     * method: GET
     * router(/api/v1/voucher)
     * author: NgocNB
     */
    getAllVouchersNgocNB = async (req, res, next) => {
        try {
            const vouchers = await VoucherService.getAllVouchersNgocNB();
            res.status(200).json({
                data: vouchers,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * method: POST
     * router(/api/v1/voucher)
     * author: NgocNB
     */
    createVoucher = async (req, res, next) => {
        try {
            const newVoucher = req.body; // Dữ liệu voucher từ client
            const createdVoucher = await VoucherService.createVoucher(newVoucher); // Tạo voucher mới
            res.status(201).json({
                message: "Voucher created successfully",
                data: createdVoucher,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * method: PUT
     * router(/api/v1/voucher/:id)
     * author: NgocNB
     */
    updateVoucher = async (req, res, next) => {
        const { id } = req.params; // Lấy id voucher từ URL params
        const updatedVoucherData = req.body; // Dữ liệu cập nhật từ client

        try {
            const updatedVoucher = await VoucherService.updateVoucher(id, updatedVoucherData); // Cập nhật voucher

            if (!updatedVoucher) {
                return res.status(404).json({ message: "Voucher not found" });
            }

            res.status(200).json({
                message: "Voucher updated successfully",
                data: updatedVoucher,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * method: DELETE
     * router(/api/v1/voucher/:id)
     * author: NgocNB
     */
    deleteVoucher = async (req, res, next) => {
        const { id } = req.params; // Lấy id voucher từ URL params
        try {
            const deletedVoucher = await VoucherService.deleteVoucher(id); // Xóa voucher
            if (!deletedVoucher) {
                return res.status(404).json({ message: "Voucher not found" });
            }
            res.status(200).json({
                message: "Voucher deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new VoucherController;
