const express = require("express")
const { handleLogin, handleLogout } = require("../controllers/loginController")

const router = express.Router()

router.post("/", handleLogin)
router.delete("/", handleLogout)

module.exports = router