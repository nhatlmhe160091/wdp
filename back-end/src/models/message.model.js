const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    sentAt: {
        type: Date,
        default: Date.now
    },
    readAt: {
        type: Date
    },
    status: {
        type: String,
        enum: ['SENT', 'READ', 'DELETED'],
        default: 'SENT',
    },
});

module.exports = mongoose.model('Message', messageSchema);
