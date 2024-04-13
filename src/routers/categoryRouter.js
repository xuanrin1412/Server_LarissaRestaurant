const express = require("express")
const { createCategory, deleteCategory, getAllCategory, updateCategory, getCategoryWithFood } = require("../controllers/categoryController")

const router = express.Router()

router.post("/", createCategory)
router.delete("/:idCategory", deleteCategory)
router.get("/", getAllCategory)
router.put("/:idCategory", updateCategory)
router.get("/getCategoryWithFood", getCategoryWithFood)


getCategoryWithFood
module.exports = router