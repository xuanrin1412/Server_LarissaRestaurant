const express = require("express")
const { createOrder, deleteOrder, getAllOrder, getOrder, updateOrder } = require("../controllers/orderController")
const router = express.Router()

router.post("/", createOrder)
// router.delete("/:idOrder", deleteOrder)
router.get("/", getAllOrder)
// router.get("/find/:idOrder", getOrder)
// router.put("/:idOrder", updateOrder)


module.exports = router