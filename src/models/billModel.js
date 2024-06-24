const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
        require: true
    },
    paymentMethod:{
        type: String,
        enum : ['cash','momo','bank'],
        default: 'cash'
    },
    total: {
        type: Number,
        require: true
    },
})
module.exports = mongoose.model("bill", billSchema)