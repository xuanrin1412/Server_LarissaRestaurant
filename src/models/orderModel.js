const mongoose = require("mongoose")
const statusArray = ["Wait for the dish", "Wait for payment", "Cancel", "Completes"]
const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users", // Reference the Users model
        required: true,
    },
    tableId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "table",
        require: true,
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
    status: {
        type: String,
        enum: statusArray,
        default: "Wait for the dish"
    },
}, {
    timestamps: true
})
// orderSchema.index({ orderId: 1 }, { unique: true });
module.exports = { statusArray }
module.exports = mongoose.model("order", orderSchema)