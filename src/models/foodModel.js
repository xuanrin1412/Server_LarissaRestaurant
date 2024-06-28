const mongoose = require("mongoose")
const foodSchema = new mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    foodName: {
        type: String,
           required: true,
        unique: true,
    },
    description: {
        type: String,
           required: true,
    },
    picture: {
        type: String,
           required: true,
    },
    costPrice: {
        type: Number,
           required: true,
    },
    revenue: {
        type: Number,
           required: true,
    },
    favourite: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
})
module.exports = mongoose.model("food", foodSchema)