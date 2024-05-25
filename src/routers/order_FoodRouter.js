const express = require("express")
const { createOrder, updateStatus, getOneOrder,getOrderFromTable, inscreaseQuantity, getAllOrder } = require("../controllers/order_FoodController")

const router = express.Router()

router.post("/", createOrder)
router.put("/:idOrder", updateStatus)
router.get("/find/:idOrder", getOneOrder)
router.get("/findOrder/:idTable", getOrderFromTable)
router.get("/", getAllOrder)
router.put("/increase/:idOrderFood", inscreaseQuantity)

module.exports = router