const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'momo', 'bank'],
        default: 'cash'
    },
    profit: {
        type: Number,
    },
}, {
    timestamps: true
})
module.exports = mongoose.model("bill", billSchema)