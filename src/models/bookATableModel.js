const mongoose = require("mongoose")

// const roles = ["admin", "moderator", "user"]
const bookATableSchema = new mongoose.Schema({
    // email: {
    //     type: String,
    //     unique: true
    // },
    // customerName: {
    //     type: String,
    //     require: true,
    // },
    // phoneNumber: {
    //     type: String,
    //     require: true,
    //     unique: true,
    // },
    // address: {
    //     type: String,
    //     require: true,
    // },
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
    }
}, {
    timestamps: true
})
module.exports = mongoose.model("BookATable", bookATableSchema)