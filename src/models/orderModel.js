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
        required: true,
    },
    shipAdress: {
        type: String
    },
    subTotal: {
        type: Number,
        // require: true
    },
    deliveryFee: {
        type: String
    },
    note: {
        type: String
    },
    discount: {
        type: Number
    },
    statusPayment: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
})
module.exports = mongoose.model("order", orderSchema)