const express = require("express")
const { createOrder, deleteOrder, getAllOrder, getOneOrder, updateOrder } = require("../controllers/orderController")

const router = express.Router()

router.post("/", createOrder)
router.delete("/:idOrder", deleteOrder)
router.get("/", getAllOrder)
router.get("/find/:idOrder", getOneOrder)
router.put("/:idOrder", updateOrder)


module.exports = router