const express = require("express")
const { createOrder,updateOrder, updateStatus, getOneOrder,getOrderFromTable, inscreaseQuantity, getAllOrder } = require("../controllers/order_FoodController")

const router = express.Router()

router.post("/", createOrder)
router.put("/:idOrder", updateStatus)
router.get("/find/:idOrder", getOneOrder)
router.get("/findOrder/:idTable", getOrderFromTable)
router.get("/", getAllOrder)
router.put("/findOrder/:idOrder", updateOrder)

module.exports = router