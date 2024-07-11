const mongoose = require("mongoose")
const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users", // Reference the Users model
        required: true,
    },
    tableId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "table",
    },
    subTotal: {
        type: Number,
    },
    note: {
        type: String
    },
    paymentIntentId: {
        type: String
    },
    customerId: {
        type: String
    },
    shipping: {
        type: Object
    },
    delivery_status: {
        type: String,
        default: "pending"
    },
    statusPayment: {
        type: Boolean,
        default: false,
    },
    payment_status: {
        type: String
    },
},
    {
        timestamps: true
    })
module.exports = mongoose.model("order", orderSchema)