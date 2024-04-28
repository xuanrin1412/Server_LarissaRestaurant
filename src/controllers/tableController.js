const Table = require("../models/tableModel")
const createTable = async (req, res) => {
    const { tableName } = req.body
    const { idArea } = req.body
    try {
        const createTable = await Table.create({
            tableName, idArea
        })
        res.status(200).json({ createTable })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching Table' });
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
module.exports = { createTable, getAllTable }