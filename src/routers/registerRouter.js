const express = require("express")
const { createUser, getAllUser, getUser, updateUser, deleteUser } = require("../controllers/registerController")
const checkLogin = require('../middleware/checkLogin.js')

const router = express.Router()

router.post("/", createUser)
router.get("/", checkLogin, getAllUser)
router.get("/find/:idUser", getUser)
router.put("/:idUser", updateUser)
router.delete("/:idUser", deleteUser)

module.exports = router