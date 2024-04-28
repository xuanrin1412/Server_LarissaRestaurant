const express = require("express")
const { createTable, getAllTable, getUser, updateUser, deleteUser } = require("../controllers/tableController")
const checkLogin = require('../middleware/checkLogin.js')

const router = express.Router()

router.post("/", createTable)
router.get("/", getAllTable)
// router.get("/find/:idUser", getUser)
// router.put("/:idUser", updateUser)
// router.delete("/:idUser", deleteUser)

module.exports = router