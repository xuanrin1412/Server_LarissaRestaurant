const User = require("../models/userModel")
var CryptoJS = require("crypto-js")
const jwt = require('jsonwebtoken')

// ===============REGISTER===================
const createUser = async (req, res) => {
    const { avatar } = req.body
    const { userName } = req.body
    const { email } = req.body
    const { phoneNumber } = req.body
    const { password } = req.body
    const { address } = req.body
    const { role } = req.body
    try {
        if (!userName || userName.trim().length === 0 || !email || email.trim().length === 0 || !password || password.trim().length === 0 || !phoneNumber || phoneNumber.length === 0 || !address || address.length === 0) {
            return res.status(400).json({ message: "Please enter all required information" });
        }
        const userEmail = await User.findOne({ email })
        const userNameD = await User.findOne({ userName })
        const userPhoneD = await User.findOne({ phoneNumber })
        if (userEmail) {
            return res.status(400).json({ message: 'Email đã tồn tại' })
        } else if (userNameD) {
            return res.status(400).json({ message: 'Tên người dùng đã tồn tại' })
        } else if (userPhoneD) {
            return res.status(400).json({ message: 'Số điện thoại đã tồn tại' })
        } else {
            let encryptedPassword = password;
            if (password) {
                encryptedPassword = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY.toString());
            }
            const newUser = await User.create({
                role,
                avatar,
                userName,
                email,
                phoneNumber,
                address,
                password: encryptedPassword
            });
            res.status(200).json({ newUser, message: 'Đăng ký thành công' })
            console.log('newUser', newUser)
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
};

// ===============GET ALL USER===================
const getAllUser = async (req, res) => {
    const user = req.user
    console.log("user getAllUser", user);

    try {
        const getAllUser = await User.find({}).sort({ createdAt: -1 });
        res.status(200).json({ getAllUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
};

// ===============GET ALL MODERATOR===================
const getAllModerator = async (req, res) => {
    try {
        const getAllModerator = await User.find({ role: "moderator" }).sort({ createdAt: -1 });
        res.status(200).json({ getAllModerator });
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
};
// ===============GET ONE USER===================
const getUser = async (req, res) => {
    const idUser = req.params.idUser
    try {
        const getUser = await User.findOne({ _id: idUser })
        res.status(200).json({ getUser });
        console.log({ getUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
};

// ===============UPDATE USER===================
const updateUser = async (req, res) => {
    const { avatar } = req.body
    const { userName } = req.body
    const { email } = req.body
    const { phoneNumber } = req.body
    const { password } = req.body
    const { address } = req.body
    const idUser = req.params.idUser
    try {
        // const userEmail = await User.findOne({ email })
        // const userNameD = await User.findOne({ userName })
        // const userPhoneD = await User.findOne({ phoneNumber })
        // if (userNameD) {
        //     return res.status(400).json({ message: 'Tên người dùng đã tồn tại' })
        // } else if (userEmail) {
        //     return res.status(400).json({ message: 'Email đã tồn tại' })
        // } else if (userPhoneD) {
        //     return res.status(400).json({ message: 'Phone Number đã tồn tại' })
        // } else {
        const updateUser = await User.findByIdAndUpdate(idUser, { $set: req.body }, { new: true })
        res.status(200).json({ updateUser });
        console.log({ updateUser });
        // }

    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
};
// ===============UPDATE AVARTAR===================
const updateAvatar = async (req, res) => {
    const idUser = req.params.idUser
    try {
        const updateUserAvatar = await User.findOneAndUpdate({ _id: idUser }, { avatar: req.body.avatar }, { new: true })
        res.status(200).json({ updateUserAvatar });
        console.log({ updateUserAvatar });
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
};

// ===============DELETE USER===================
const deleteUser = async (req, res) => {
    const idUser = req.params.idUser
    try {
        const deleteUser = await User.findByIdAndDelete({ _id: idUser })
        res.status(200).json({ message: "Delete user successfull" });
        console.log({ deleteUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
};
module.exports = { createUser, getAllModerator, getAllUser, getUser, updateUser, deleteUser, updateAvatar }