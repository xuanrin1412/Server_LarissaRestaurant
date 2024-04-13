const express = require("express")
const { createArea, deleteArea, getAllArea, getOneArea, updateArea } = require("../controllers/areaController")

const router = express.Router()

router.post("/", createArea)
router.delete("/:idArea", deleteArea)
router.get("/", getAllArea)
router.get("/find/:idArea", getOneArea)
router.put("/:idArea", updateArea)


module.exports = router