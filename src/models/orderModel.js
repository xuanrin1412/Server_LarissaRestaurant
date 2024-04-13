const mongoose = require("mongoose")
const areaSchema = new mongoose.Schema({
    userId: {
        type: String,
        require: true,
        unique: true,
    },
    userId: {
        type: String,
        require: true,
        unique: true,
    },
    ship: {

    }
}, {
    timestamps: true
})
module.exports = mongoose.model("area", areaSchema)