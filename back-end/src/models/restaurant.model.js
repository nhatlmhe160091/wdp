const mongoose = require('mongoose');
const { Schema } = mongoose;

const activeTimeSchema = new mongoose.Schema({
    open: {
        type: String,
        required: [true, "Thời gian mở cửa là bắt buộc."]
    },
    close: {
        type: String,
        required: [true, "Thời gian đóng cửa là bắt buộc."]
    }
});

const locationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
        required: true,
    },
    coordinates: {
        type: [Number], // Mảng chứa [latitude, longitude]
        required: true,
        validate: {
            validator: (v) => v.length === 2, // Đảm bảo có đúng 2 giá trị
            message: 'Tọa độ cần phải có đúng 2 giá trị lần lượt là: [latitude, longitude]',
        },

    },
});

const restaurantSchema = new Schema({
    name: {
        type: String,
        required: [true, "Tên nhà hàng là bắt buộc."],
        unique: [true, "Tên nhà hàng đã tồn tại trước đó."]
    },
    location: {
        type: locationSchema
    },
    phoneNumber: {
        type: String,
        required: [true, "Số điện thoại là bắt buộc."],
        validate: {
            validator: function (value) {
                return /(84|0[3|5|7|8|9])+([0-9]{8})\b/g.test(value)
            },
            message: "Số điện thoại phải có 10 chữ số."
        }
    },
    services: {
        projector: { type: Boolean, default: false }, // Máy chiếu
        childSeat: { type: Boolean, default: false }, // Ghế trẻ em
        privateRoom: { type: Boolean, default: false }, // Phòng riêng
        outDoorTable: { type: Boolean, default: false }, // Bàn ngoài trời
        balconyTable: { type: Boolean, default: false }, // Bàn ban công
        childrenArea: { type: Boolean, default: false }, // Chỗ chơi cho trẻ em
        smokingArea: { type: Boolean, default: false }, // Chỗ hút thuốc
        karaoke: { type: Boolean, default: false }, // Karaoke
        eventDecoration: { type: Boolean, default: false }, // Trang trí sự kiện
        cashPayment: { type: Boolean, default: false }, // Thanh toán tiền mặt
        visaCard: { type: Boolean, default: false }, // Thanh toán bằng visa
        carParking: { type: Boolean, default: false }, // Chỗ để xe ô tô
        motorbikeParking: { type: Boolean, default: false }, // Chỗ để xe máy
        mc: { type: Boolean, default: false } // MC dẫn chương trình
    },
    activeTime: {
        monday: activeTimeSchema,
        tuesday: activeTimeSchema,
        wednesday: activeTimeSchema,
        thursday: activeTimeSchema,
        friday: activeTimeSchema,
        saturday: activeTimeSchema,
        sunday: activeTimeSchema
    },
    totalTable: {
        type: Number,
        min: [0, "Tổng số bàn không được âm."],
        default: 0
    },
    totalFloor: {
        type: Number,
        min: [0, "Tổng số tầng không được âm."],
        default: 1
    },
    address: {
        type: String,
        maxLength: [200, "Địa chỉ không được quá 200 ký tự."]
    },
    description: {
        type: String,
        maxLength: [500, "Mô tả không được quá 500 ký tự."]
    },
    images: [{
        type: Schema.Types.ObjectId,
        ref: 'Image'
    }],
    disable: {
        type: Boolean,
        default: true
    }

}, { timestamp: true });

module.exports = mongoose.model("Restaurant", restaurantSchema);