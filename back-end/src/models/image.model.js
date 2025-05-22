const mongoose = require('mongoose');
const { Schema } = mongoose
const imageSchema = new Schema({
    url: {
        type: String
    },
    altText: {
        type: String,
        maxLength: 100
    },
    entityId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    entityType: {
        type: String,
        enum: ['VOUCHER', 'DISH', 'RESTAURANT'],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Image', imageSchema);
