const Area = require("../models/areaModel")
// var CryptoJS = require("crypto-js")
// const jwt = require('jsonwebtoken')

const createArea = async (req, res) => {
    try {
        const newArea = await Area.create({
            areaName: req.body.areaName
        })
        res.status(200).json({ message: "Created Successfull", newArea })


    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: error.message });
    }
}
const getAllArea = async (req, res) => {
    try {
        const getAllArea = await Area.find({})
        res.status(200).json({ getAllArea })
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: error.message });
    }
}
const getOneArea = async (req, res) => {
    const idArea = req.params.idArea
    try {
        const getOneArea = await Area.findOne({ _id: idArea })
        res.status(200).json({ getOneArea })
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: error.message });
    }
}
const deleteArea = async (req, res) => {
    const idArea = req.params.idArea
    try {
        const deleteArea = await Area.findByIdAndDelete({
            _id: idArea
        })
        res.status(200).json({ message: "Deleted Successfull", deleteArea })


    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: error.message });
    }
}
const updateArea = async (req, res) => {
    const idArea = req.params.idArea
    try {
        const updateArea = await Area.findByIdAndUpdate(idArea, { $set: req.body }, { new: true })
        res.status(200).json({ message: "Updated Successfull", updateArea })
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: error.message });
    }
}
module.exports = { createArea, getAllArea, getOneArea, deleteArea, updateArea }