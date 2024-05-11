const mongoose = require("mongoose")
const foodSchema = new mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    foodName: {
        type: String,
        require: true,
        unique: true,
    },
    description: {
        type: String,
        require: true,
    },
    picture: {
        type: String,
        require: true,
    },
    costPrice: {
        type: Number,
        require: true,
    },
    revenue: {
        type: Number,
        require: true,
    },
    favourite: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
})
module.exports = mongoose.model("food", foodSchema)