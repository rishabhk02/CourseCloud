const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Course'
    }]
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;