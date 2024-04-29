const Table = require("../models/tableModel")
const Area = require("../models/areaModel")

const createTable = async (req, res) => {
    const { tableName, capacity, areaId } = req.body;
    try {
        const areaName = await Area.findById(areaId).select('areaName');
        const uniqueTableName = `${areaName.areaName} - ${tableName}`;

        const existingTable = await Table.findOne({ tableName: uniqueTableName, areaId: areaId });
        if (existingTable) {
            return res.status(400).json({ message: 'Table name already exists in this area' });
        }
        const createTable = await Table.create({
            tableName: uniqueTableName,
            areaId,
            capacity,
        });
        res.status(200).json({ createTable });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating Table' });
    }
}

const getAllTable = async (req, res) => {
    try {
        const getAllTable = await Table.find({})
        res.status(200).json({ getAllTable })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching getAllTable' });
    }
}
const getTable = async (req, res) => {
    const idTable = req.params.idTable
    try {
        const getTable = await Table.findById({ _id: idTable })
        res.status(200).json({ getTable })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching getTable' });
    }
}

const updateTable = async (req, res) => {
    const idTable = req.params.idTable
    try {
        const updateTable = await Table.findByIdAndUpdate({ _id: idTable })
        res.status(200).json({ updateTable })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching getAllTable' });
    }
}

const deleteTable = async (req, res) => {
    const idTable = req.params.idTable
    try {
        const deleteTable = await Table.findByIdAndDelete({ _id: idTable })
        res.status(200).json({ deleteTable })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching getAllTable' });
    }
}
module.exports = { createTable, getAllTable, getTable, updateTable, deleteTable }