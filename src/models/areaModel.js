const mongoose = require("mongoose")
const areaSchema = new mongoose.Schema({
    areaName: {
        type: String,
        require: true,
        unique: true,
    },
}, {
    timestamps: true
})
module.exports = mongoose.model("area", areaSchema)