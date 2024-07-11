const Food = require("../models/foodModel")
// var CryptoJS = require("crypto-js")
// const jwt = require('jsonwebtoken')

const createFood = async (req, res) => {
    const { foodName } = req.body
    const { picture } = req.body
    const { description } = req.body
    const { costPrice } = req.body
    const { revenue } = req.body
    const { favourite } = req.body
    const { categoryId } = req.body
    console.log("res body add food",req.body);
    
    try {
        const newFood = await Food.create({
            foodName,
            picture,
            description,
            costPrice,
            revenue,
            favourite,
            categoryId,
        })
        res.status(200).json({ message: "Created Food Successfull", newFood })
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: error.message });
    }
}
const getAllFood = async (req, res) => {
    try {
        await Food.find({}).sort({ createdAt: -1 })
            .populate('categoryId', 'categoryName') // Chỉ lấy trường categoryName từ danh mục
            .then(foods => {
                console.log(foods); // Danh sách các món ăn với thông tin danh mục (chỉ categoryName)
                return res.status(200).json({ foods })
            })
            .catch(err => {
                console.error(err);
            });
        // res.status(200).json({ getAllFood })
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: error.message });
    }
}
const getOneFood = async (req, res) => {
    const idFood = req.params.idFood
    try {
        const getOneFood = await Food.findById({ _id: idFood }).populate("categoryId")
        res.status(200).json({ getOneFood })
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: error.message });
    }
}
const deleteFood = async (req, res) => {
    const idFood = req.params.idFood
    try {
        const deleteFood = await Food.findByIdAndDelete({
            _id: idFood
        })
        res.status(200).json({ message: "Deleted Food Successfull", deleteFood })
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: error.message });
    }
}
const updateFood = async (req, res) => {
    const idFood = req.params.idFood
    try {
        const updateFood = await Food.findByIdAndUpdate(idFood, { $set: req.body }, { new: true })
        res.status(200).json({ message: "Updated Food Successfull", updateFood })
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: error.message });
    }
}
// const getFoodFromCategory = async (req, res) => {
//     const idCategory = req.params.idCategory
//     try {
//         await Food.find({ idCategory })
//             .populate('categoryId', 'categoryName') // Chỉ lấy trường categoryName từ danh mục
//             .then(foods => {
//                 console.log(foods); // Danh sách các món ăn với thông tin danh mục (chỉ categoryName)
//                 return res.status(200).json({ foods })
//             })
//             .catch(err => {
//                 console.error(err);
//             });

//     } catch (error) {
//         console.error("Error:", error);
//         return res.status(500).json({ error: error.message });
//     }
// }
module.exports = { createFood, getAllFood, deleteFood, updateFood, getOneFood }