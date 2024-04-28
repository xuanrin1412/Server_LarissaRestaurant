const mongoose = require("mongoose")
const tableSchema = new mongoose.Schema({
    tableName: {
        type: String,
        require: true,
        unique: true,
    },
    idArea: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'area',
        required: true
    }
}, {
    timestamps: true
})
module.exports = mongoose.model("table", tableSchema)