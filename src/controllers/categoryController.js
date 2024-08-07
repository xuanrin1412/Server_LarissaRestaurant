const Category = require("../models/categoryModel");
const Food = require("../models/foodModel");
// var CryptoJS = require("crypto-js")
// const jwt = require('jsonwebtoken')

const createCategory = async (req, res) => {
    try {
        const newCategory = await Category.create({
            categoryName: req.body.categoryName
        })
        res.status(200).json({ message: "Created Successfull", newCategory })


    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: "Tên danh mục món ăn bị trùng *" });
        }

        return res.status(500).json({ error: error.message });
    }
}
const getAllCategory = async (req, res) => {
    try {
        const getAllCategory = await Category.find().sort({ createdAt: -1 })
        res.status(200).json({ getAllCategory })
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: error.message });
    }
}
const deleteCategory = async (req, res) => {
    const idCategory = req.params.idCategory
    try {
        const findFoodFromCategory = await Food.findOne({ categoryId: idCategory })
        if (findFoodFromCategory) {
            return res.status(400).json({ statusError: "Category have foods", message: "You can't delete Category when have food" })
        } else {
            const deleteCategory = await Category.findByIdAndDelete({
                _id: idCategory
            })
            res.status(200).json({ message: "Deleted Successfull", deleteCategory })
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: error.message });
    }
}
const updateCategory = async (req, res) => {
    const idCategory = req.params.idCategory
    try {
        const updateCategory = await Category.findByIdAndUpdate(idCategory, { $set: req.body }, { new: true })
        res.status(200).json({ message: "Updated Successfull", updateCategory })
    } catch (error) {
        console.error("Error:", error);
        if (error.code === 11000) { // Kiểm tra lỗi trùng lặp khóa
            return res.status(400).json({ error: "Cập nhật thất bại bị trùng tên danh mục món ăn !" });
        }
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
module.exports = { createCategory, getAllCategory, deleteCategory, updateCategory, getCategoryWithFood }