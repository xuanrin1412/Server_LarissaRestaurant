const mongoose = require("mongoose")
const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true
})
module.exports = mongoose.model("category", categorySchema)