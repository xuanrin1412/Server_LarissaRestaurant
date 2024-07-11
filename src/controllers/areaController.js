const Area = require("../models/areaModel")
const Table = require("../models/tableModel")
// var CryptoJS = require("crypto-js")
// const jwt = require('jsonwebtoken')

const createArea = async (req, res) => {
    try {
        const newArea = await Area.create({
            areaName: req.body.areaName
        });
        res.status(200).json({ message: "Created Successfully", newArea });
    } catch (error) {
        console.error("Error:", error);
        
        if (error.code === 11000) { // Kiểm tra lỗi trùng lặp khóa
            return res.status(400).json({ error: "Duplicate key error: An area with this name already exists." });
        }

        return res.status(500).json({ error: error.message });
    }
};

const getAllArea = async (req, res) => {
    try {
        const getAllArea = await Area.find({}).sort({ createdAt: -1 });
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






// Helper function to populate area details efficiently
const populateTableDetails = async (idArea) => {
    const tableDocs = await Table.find({ areaId: idArea })
        .select('-areaId'); // Exclude unnecessary field
    return tableDocs;
};

// API endpoint to retrieve categories with populated food (using async/await)
const getAreaWithTable = async (req, res) => {
    const io = req.io;
    try {
        const areas = await Area.find();
        const populatedAreas = await Promise.all(
            areas.map(async (area) => ({
                areaName: area.areaName,
                areaId: area._id,
                table: await populateTableDetails(area._id),
            }))
        );
        console.log(populatedAreas);
        io.emit('area_with_table', {
            populatedAreas
        });
        res.json(populatedAreas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching Category with Food' });
    }
}
module.exports = { getAreaWithTable, createArea, getAllArea, getOneArea, deleteArea, updateArea }