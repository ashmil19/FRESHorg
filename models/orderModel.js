const mongoose = require('mongoose');
const schema = mongoose.Schema;


const  orderSchema = schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "users",
        required: true,
    },
    address: {
        type: mongoose.Types.ObjectId,
        ref: "address",
        required: true,
    },
    items: [
        {
            type: mongoose.Types.ObjectId,
            ref: "orderItem",
            required: true
        },
    ],
    price: {
        type: Number,
        required: true,   
    },
    order_status: {
        type: String,
        default: "pending"
    },
    payment_status: {
        type: Boolean,
    },
    payment_method: {
        type: String,
        required: true,
    },
    order_date: {
        type: Date,
        default: Date.now(),
    },
    coupon: {
        type: mongoose.Types.ObjectId,
        ref: "coupon"
    },
    razorpay_order_id: {
        type: String,
    }
    
})



module.exports = mongoose.model('order', orderSchema);