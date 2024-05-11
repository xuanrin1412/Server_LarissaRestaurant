const mongoose = require("mongoose");

const orderFoodSchema = new mongoose.Schema({
    foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "food",
        require: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
        require: true
    },
    quantity: {
        type: Number,
        require: true

    },
    note: {
        type: String
    }

})
module.exports = mongoose.model("orderFood", orderFoodSchema)