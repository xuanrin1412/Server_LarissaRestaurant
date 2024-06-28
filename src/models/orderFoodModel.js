const mongoose = require("mongoose");

const orderFoodSchema = new mongoose.Schema({
    foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "food",
           required: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
           required: true
    },
    quantity: {
        type: Number,
           required: true
    },
    totalEachFood: {
        type: Number,
           required: true
    },
})
module.exports = mongoose.model("orderFood", orderFoodSchema)