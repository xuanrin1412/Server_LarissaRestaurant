const Order = require("../models/OrderModel")
const User = require("../models/userModel")
// var CryptoJS = require("crypto-js")
// const jwt = require('jsonwebtoken')

const createOrder = async (req, res) => {
    const { userId } = req.body
    const { tableId } = req.body
    const { shipAddress } = req.body
    const { subTotal } = req.body
    const { deliveryFee } = req.body
    const { note } = req.body
    const { discount } = req.body
    const { status } = req.body
    try {
        const user = await User.findOne({ _id: userId })
        console.log(user.role);

        if (user.role === "moderator") {
            const newOrder = await Order.create({
                userId,
                tableId,
                subTotal,
                discount,
                note,
                status
            })
            res.status(200).json({ message: "Created order Successfull OFFLINE", newOrder })
        } else if (user.role === "user") {
            const newOrder = await Order.create({
                userId,
                shipAddress,
                subTotal,
                deliveryFee,
                discount,
                note,
            })
            res.status(200).json({ message: "Created order Successfull ONLINE", newOrder })
        } else {
            res.status(401).json({ message: "Error getting user role" })
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: error.message });
    }
}
const getAllOrder = async (req, res) => {
    try {
        const getAllOrder = await Order.find({})
        res.status(200).json({ getAllOrder })
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: error.message });
    }
}

const getOneOrder = async (req, res) => {
    const idOrder = req.params.idOrder
    try {
        const getOneOrder = await Order.findOne({ _id: idOrder })
        res.status(200).json({ getOneOrder })
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: error.message });
    }
}
const deleteOrder = async (req, res) => {
    const idOrder = req.params.idOrder
    try {
        const deleteOrder = await Order.findByIdAndDelete({
            _id: idOrder
        })
        res.status(200).json({ message: "Deleted Successfull", deleteOrder })


    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: error.message });
    }
}
const updateOrder = async (req, res) => {
    const idOrder = req.params.idOrder
    try {
        const updateOrder = await Order.findByIdAndUpdate(idOrder, { $set: req.body }, { new: true })
        res.status(200).json({ message: "Updated Successfull", updateOrder })
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: error.message });
    }
}





// Helper function to populate food details efficiently
const populateFoodDetails = async (idCategory) => {
    const foodDocs = await Food.find({ categoryId: idCategory })
        .select('-categoryId'); // Exclude unnecessary field
    return foodDocs;
};

// API endpoint to retrieve categories with populated food (using async/await)
const getCategoryWithFood = async (req, res) => {
    try {
        const categories = await Category.find();
        const populatedCategories = await Promise.all(
            categories.map(async (category) => ({
                categoryName: category.categoryName,
                food: await populateFoodDetails(category._id),
            }))
        );
        console.log(populatedCategories);
        res.json(populatedCategories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching Category with Food' });
    }
}
module.exports = { createOrder, getAllOrder, getOneOrder, deleteOrder, updateOrder }