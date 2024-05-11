const express = require("express")
const { createFood, deleteFood, getAllFood, getFoodFromCategory, updateFood, getOneFood } = require("../controllers/foodController")

const router = express.Router()

router.post("/", createFood)
router.delete("/:idFood", deleteFood)
router.get("/", getAllFood)
router.put("/:idFood", updateFood)
router.get("/find/:idFood", getOneFood)
// router.get("/findFoodFCategory/:idCategory", getFoodFromCategory)


module.exports = router