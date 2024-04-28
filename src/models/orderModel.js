const mongoose = require("mongoose")
const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        unique: true,
    },
    tableId: {
        type: mongoose.Schema.Types.ObjectId | null,
        require: true,
        unique: true,
    },
    shipAdress: {
        type: String
    },
    totalFoodOrder: {
        type: String
    },
    ship: {
        type: String
    },
    note: {
        type: String
    },
    status: {
        require: true,
        type: String
    }
}, {
    timestamps: true
})
module.exports = mongoose.model("order", orderSchema)