const express = require("express")
const { createUser, getAllUser, getUser, updateUser, getAllModerator, deleteUser, updateAvatar } = require("../controllers/registerController")
const checkLogin = require('../middleware/checkLogin.js')

const router = express.Router()

router.post("/", createUser)
router.get("/", checkLogin, getAllUser)
router.get("/getAllModerator", checkLogin, getAllModerator)
router.get("/find/:idUser", getUser)
router.put("/:idUser", updateUser)
router.put("/updateAvatar/:idUser", updateAvatar)
router.delete("/:idUser", deleteUser)

module.exports = router