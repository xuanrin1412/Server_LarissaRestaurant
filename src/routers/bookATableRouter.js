const express = require("express")
const { createBookingATable ,getAllBooking,getOneBooking,updateBookingStatus} = require("../controllers/bookATableController.js")
const checkLogin = require('../middleware/checkLogin.js')

const router = express.Router()
router.post("/",createBookingATable)
router.get("/",getAllBooking)
router.get("/find/:idBooking", getOneBooking)
router.put("/updateStatus/:idBooking", updateBookingStatus)
// router.put("/:idUser", updateUser)
// router.delete("/:idUser", deleteUser)

module.exports = router