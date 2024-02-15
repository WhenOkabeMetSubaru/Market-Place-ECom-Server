const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    transaction_type: {
        type: String
    },
    payment_mode: {
        type: String
    },
    total_amount_paid: {
        type: Number
    },
    due_amount: {
        type: Number
    },
    sender_name: {
        type: String
    },
    receiver_name: {
        type: String
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    order: {
        type: mongoose.Schema.ObjectId
    }
})


module.exports = mongoose.model('Transaction', TransactionSchema);