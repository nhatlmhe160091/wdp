const mongoose = require('mongoose');
const { Schema } = mongoose;

const tableSchema = new Schema({
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant'
    },
    tableNumber: {
        type: Number,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        enum: ['INDOOR', 'OUTDOOR', 'BALCONY', 'UPSTAIR', 'OTHER'],
        required: true
        /*
            INDOOR: Bàn trong nhà.
            OUTDOOR: Bàn ngoài trời.
            BALCONY: Bàn trên ban công.
            UPSTAIR: Bàn trên tầng.
         */
    }
}, { timestamp: true });

module.exports = mongoose.model("Table", tableSchema);
