const mongoose = require("mongoose")

const statusOptions = ["Chưa xác nhận", "Đã xác nhận", "Đã chuẩn bị bàn"]
const bookATableSchema = new mongoose.Schema({
    userInfo: {
        type: Object,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    totalPerson: {
        type: String,
        required: true
    },
    space: {
        type: String,
        required: true
    },
    note: {
        type: String,
    },
    status: {
        type: String,
        enum: statusOptions,
        default: "Chưa xác nhận"
    }
}, {
    timestamps: true
})
module.exports = mongoose.model("BookATable", bookATableSchema)