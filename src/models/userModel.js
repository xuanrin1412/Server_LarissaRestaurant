const mongoose = require("mongoose")

const roles = ["admin", "moderator", "user"]
const userSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: roles,
        default: "user"
    },
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
})
module.exports = mongoose.model("Users", userSchema)