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
        require: true,
        unique: true,
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
}, {
    timestamps: true
})
module.exports = mongoose.model("Users", userSchema)