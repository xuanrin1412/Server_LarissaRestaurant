const jwt = require("jsonwebtoken")
function checkLogin(req, res, next) {
    const checkTokenLogin = req.cookies.tokenRestaurants
    if (checkTokenLogin) {
        const decoded = jwt.verify(checkTokenLogin, process.env.SECRET_KEY)
        req.user = decoded
        next()
    } else {
        return res.json({ message: "You haven't login", result: [] })
    }
}
module.exports = checkLogin