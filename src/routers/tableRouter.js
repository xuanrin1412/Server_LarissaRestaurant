const express = require("express")
const { createTable, getAllTable, getTable, updateTable, deleteTable } = require("../controllers/tableController")
const checkLogin = require('../middleware/checkLogin.js')

const router = express.Router()

router.post("/", createTable)
router.get("/", getAllTable)
router.get("/find/:idTable", getTable)
router.put("/:idTable", updateTable)
router.delete("/:idTable", deleteTable)

module.exports = router