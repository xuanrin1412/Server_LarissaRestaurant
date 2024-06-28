const User = require("../models/userModel")
var CryptoJS = require("crypto-js")
const jwt = require('jsonwebtoken')

// ===============LOGIN===================
const handleLogin = async (req, res) => {
    try {
        const user = await User.findOne({ userName: req.body.userName });
        if (!user) {
            return res.status(404).json({ message: "Uesr does not exist !!!" });
        }
        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.SECRET_KEY
        ).toString(CryptoJS.enc.Utf8);

        if (hashedPassword === req.body.password) {
            const tokenJWT = jwt.sign(
                {
                    id: user._id,
                    role: user.role,
                    userName: user.userName,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    address: user.address,
                },
                process.env.SECRET_KEY,
            );
            res.cookie('tokenRestaurants', tokenJWT);
            return res.status(200).json({ tokenJWT, message: 'Login successful' });
        } else {
            return res.status(400).json({
                message: 'Failed to login. Check your password !!!',
            });
        }
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ error: err.message });
    }
};

// ===============LOGOUT===================
const handleLogout = async (req, res) => {
    const deleteJWT = await res.clearCookie('tokenRestaurants')
    if (deleteJWT) {
        res.json({ message: 'Logout Success' })
    } else {
        res.json({ message: 'Logout Defeat' })
    }
}


module.exports = { handleLogin, handleLogout }