const mongoose = require('mongoose');
const { Schema } = mongoose;

const dishSchema = new Schema({
    name: {
        type: String,
        required: [true, "Tên món ăn là bắt buộc."],
        unique: [true, "Tên món ăn đã tồn tại trước đó."],
        minLength: [3, "Tên món ăn phải có ít nhất 3 ký tự."],
        maxLength: [100, "Tên món ăn không được quá 100 ký tự."],
    },
    price: {
        type: Number,
        required: [true, "Giá món ăn là bắt buộc."],
        min: [0, "Giá món ăn phải là một số dương."]
    },
    category: {
        type: String,
        enum: {
            values: ["APPETIZER", "MAIN_COURSE", "DESSERT", "BEVERAGE", "SALAD", "SOUP"],
            message: "Danh mục phải là một trong các giá trị: APPETIZER, MAIN_COURSE, DESSERT, BEVERAGE, SALAD, SOUP."
        },
        /**
         * APPETIZER: Món khai vị.
         * MAIN_COURSE: Món chính.
         * DESSERT: Món tráng miệng.
         * BEVERAGE: Đồ uống.
         * SALAD: Salad.
         * SOUP: Súp.
         */
        required: [true, "Danh mục món ăn là bắt buộc."]

    },
    description: {
        type: String,
        maxLength: [300, "Mô tả món ăn không được quá 300 ký tự."]
    },
    foodTag: {
        type: String,
        enum: {
            values: ["HOT_SALE", "SEASONAL", "CHEF_SPECIAL"],
            message: "Thẻ món ăn phải là một trong các giá trị: HOT_SALE, SEASONAL, CHEF_SPECIAL."
        },
        default: "SEASONAL"
    },
    restaurants: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Restaurant',
            default: []
        }
    ],
    images: [{
        type: Schema.Types.ObjectId,
        ref: 'Image'
    }],
    disable: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Dish", dishSchema);