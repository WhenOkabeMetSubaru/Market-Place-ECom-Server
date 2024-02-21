const mongoose = require('mongoose');


const CartSchema = new mongoose.Schema({
    product:{
        type:mongoose.Schema.ObjectId,
        ref:'Product'
    },
    quantity:Number,
    shop:{
        type:mongoose.Schema.ObjectId,
        ref:'Shop'
    },
    status:{
        type:String,
        default:'Not processed',
        enum:['Not processed','Processing','Shipped','Delivered','Cancelled','Return']
    }
});


const OrderSchema = new mongoose.Schema({
    customer_name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    customer_email: {
        type: String,
        trim: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email'],
        required: 'Email is required'
    },
    ordered_by: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    transaction_ID: {
        type: String
    },
    delivery_fee: {
        type: Number,
        default: 0
    },
    phone: {
        type: String
    },
    packaging_charge: {
        type: Number
    },
    // order_status:{
    //     type:String
    // },
    total: {
        type: Number,
        required: 'total is required'
    },
    products:{
        type:CartSchema
    },
    delivery_address: {
        type:mongoose.Schema.ObjectId,
        ref:"Address"
    },
    order_type: {
        type: String
    },
    status:{
        type:String,
        enum:['pending','approved','cancelled','processing','out for delivery','delivered','returned'],
        default:'pending'
    },
    total_products: {
        type: Number
    },
    total_quantity: {
        type: Number
    },
    created: {
        type: Date,
        default: Date.now()
    },
    order_subtotal: {
        type: Number
    },
    gst_amount: {
        type: Number
    },
    gst_applied: {
        type: String
    },
    total_taxes: {
        type: Number
    },
    total_discount: {
        type: Number
    }


});

module.exports = mongoose.model('Order',OrderSchema);