const { isInteger } = require('lodash');
const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    description: {
        type: String,
        trim: true
    },
    image: {
        data: Buffer,
        contentType: String
    },
    location: {
        lat: {
            type: String
        },
        long: {
            type: String
        }
    },
    address: {
        type: String,
        trim: true
    },
    ratings: {
        type: String,
        default: '4'
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    default_discount: {
        type: String,
        default: '0'
    },
    active: {
        type: Boolean,
        default: false
    },
    updated: Date,
    created: {
        type: Date,
        default: Date.now()
    }
    ,
    shop_category: {
        type: String,
        default: 'others'
    },
    shop_status: {
        type: String,
        default: 'pending'
    },
    shop_behavior_rating: {
        type: String,
        default: 'Normal'
    },
    shop_activity: {
        type: String
    },
    participating_discount: [
        {
            type: String
        }
    ],

})

module.exports = mongoose.model('Shop',ShopSchema);