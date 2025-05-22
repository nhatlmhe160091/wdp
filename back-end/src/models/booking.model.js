const mongoose = require('mongoose');
const { Schema } = mongoose
const bookingSchema = new Schema({
    bookingTime: {
        type: Date,
        required: true,
        // validate: {
        //     validator: function (value) {
        //         return value > Date.now();
        //     },
        //     message: "Thời gian đặt bàn phải ở tương lai."
        // }
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    guest: {
        type: Schema.Types.ObjectId,
        ref: 'Guest'
    },
    note: {
        type: String,
        maxLength: [500, "Ghi chú không được quá 500 ký tự."],
        default: ''
    },
    adultsCount: {
        type: Number,
        max: [100, "Số lượng người lớn không được quá 100."],
        min: [1, "Số lượng người lớn phải ít nhất 1."],
        default: 1,
        required: [true, "Số lượng người lớn là bắt buộc."]
    },
    childrenCount: {
        type: Number,
        max: [100, "Số lượng trẻ em không được quá 100."],
        min: [0, "Số lượng trẻ em không thể âm."],
        default: 0,
        required: [true, "Số lượng trẻ em là bắt buộc."]
    },
    status: {
        type: String,
        enum: {
            values: ['PENDING', 'CONFIRMED', 'TABLE_ASSIGNED', 'CANCELLED', 'COMPLETED'],
            message: "Trạng thái phải là một trong các giá trị: PENDING, CONFIRMED, TABLE_ASSIGNED, CANCELLED, COMPLETED."
        },
        default: 'PENDING',
        required: [true, "Trạng thái là bắt buộc."]
    },
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
       required: [true, "Nhà hàng là bắt buộc."]
    },
    reservation: {
        table: [{
            type: Schema.Types.ObjectId,
            ref: 'Table',
            required: true
        }],
        status: {
            type: String,
            enum: ['AVAILABLE', 'RESERVED', 'OCCUPIED', 'CLEANING', 'CLOSED'],
            default: 'AVAILABLE',
            required: true
        },
    },
    leaveAt: {
        type: Date
    },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
