const express = require("express")
const { createBill, getAllBill,getOneBill, } = require("../controllers/billController")

const router = express.Router()

router.post("/", createBill)
// router.put("/:idOrder", updateStatus)
// router.get("/find/:idOrder", getOneOrder)
// router.get("/findOrder/:idTable", getOrderFromTable)
router.get("/", getAllBill)
router.get("/getOneBill/:idBill", getOneBill)

// router.put("/findOrder/:idOrder", updateOrder)
// router.put("/findOrderNote/:idOrder", updateNote)

module.exports = router