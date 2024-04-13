const mongoose = require("mongoose")
const foodSchema = new mongoose.Schema({
    foodName: {
        type: String,
        require: true,
        unique: true,
    },
    picture: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    costPrice: {
        type: Number,
        require: true,
    },
    sellingPrice: {
        type: Number,
        require: true,
    },
    favourite: {
        type: Boolean,
        default: false
    },
    idCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    }
}, {
    timestamps: true
})
module.exports = mongoose.model("food", foodSchema)