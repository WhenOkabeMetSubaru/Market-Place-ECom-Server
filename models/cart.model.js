const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    total_amount: {
        type: Number,
        default: 0.0
    },
    total_discount: {
        type: Number,
        default: 0.0
    },
    total_items: {
        type: Number,
        default: 0
    },
    total_quantity: {
        type: Number,
        default: 0
    },
    delivery_fee: {
        type: Number,
        default: 0
    },
    products: [
        {
            _id: false,
            product: {
                type: mongoose.Schema.ObjectId,
                ref: 'Product'
            },
            quantity: {
                type: Number
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Cart', CartSchema);
