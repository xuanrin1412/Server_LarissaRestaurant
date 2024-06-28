const express = require("express")
const { createBookingATable } = require("../controllers/bookATableController.js")
const checkLogin = require('../middleware/checkLogin.js')

const router = express.Router()
router.post("/",createBookingATable)
// router.get("/", checkLogin, getAllUser)
// router.get("/find/:idUser", getUser)
// router.put("/:idUser", updateUser)
// router.delete("/:idUser", deleteUser)

module.exports = router