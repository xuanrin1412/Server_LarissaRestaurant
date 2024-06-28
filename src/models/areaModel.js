const mongoose = require("mongoose")
const areaSchema = new mongoose.Schema({
    areaName: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true
})
module.exports = mongoose.model("area", areaSchema)