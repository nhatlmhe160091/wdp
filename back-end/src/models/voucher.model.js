const mongoose = require('mongoose');
const { Schema } = mongoose;

const voucherSchema = new Schema({
    code: {
        type: String,
        required: [true, "Mã voucher là bắt buộc."],
        unique: [true, "Mã voucher phải là duy nhất."],
        minLength: [5, "Mã voucher phải có ít nhất 5 ký tự."],
        maxLength: [20, "Mã voucher không được quá 20 ký tự."]

    },
    discountPercentage: {
        type: Number,
        required: [true, "Phần trăm giảm giá là bắt buộc."],
        min: [0, "Phần trăm giảm giá không được âm."],
        max: [100, "Phần trăm giảm giá không được vượt quá 100."]
    },
    validFrom: {
        type: Date,
        required: [true, "Thời gian bắt đầu là bắt buộc."],
        validate: {
            validator: function (value) {
                return value >= new Date();
            },
            message: "Thời gian bắt đầu không được trong quá khứ."
        }
    },
    validTo: {
        type: Date,
        required: [true, "Thời gian kết thúc là bắt buộc."],
        validate: {
            validator: function (value) {
                return value > this.validFrom;
            },
            message: "Thời gian kết thúc phải sau thời gian bắt đầu."
        }
    },
    restaurants: [{
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: [true, "Danh sách nhà hàng là bắt buộc."],
    }],
    dishes: [{
        type: Schema.Types.ObjectId,
        ref: 'Dish',
        required: [true, "Danh sách món ăn là bắt buộc."],
    }],
    description: {
        type: String,
        maxLength: [500, "Mô tả không được quá 500 ký tự."]
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamp: true });

module.exports = mongoose.model("Voucher", voucherSchema);
