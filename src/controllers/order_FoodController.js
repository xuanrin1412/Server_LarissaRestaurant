const { json } = require("express");
const Order = require("../models/OrderModel")
const Food = require("../models/foodModel")
const OrderFood = require("../models/orderFoodModel")
const User = require("../models/userModel");

const createOrder = async (req, res) => {
    const { userId, tableId, note, status, foods, discount } = req.body;

    try {
        const user = await User.findOne({ _id: userId });
        if (user.role === "moderator") {
            // Calculate subTotal
            let accumulatedSubTotal = 0;
            for (const food of foods) {
                const foodPrice = await Food.findById(food._id).select('revenue');
                accumulatedSubTotal += foodPrice.revenue * food.quantity;
            }
            // order
            const newOrder = await Order.create({
                userId,
                tableId,
                subTotal: accumulatedSubTotal,
                discount,
                note,
                status,
            });
            // add food
            const orderId = newOrder._id.toHexString();
            const addFoodPromises = foods.map(async food => {

                return OrderFood.create({
                    foodId: food._id,
                    orderId: orderId,
                    quantity: food.quantity,
                    note,
                });
            });
            const foodsArr = await Promise.all(addFoodPromises);
            const populatedFoodsArr = await OrderFood.find({ orderId: orderId }).populate('foodId');
            console.log("foodsArr", foodsArr)
            res.status(200).json({
                message: "Created order Successfully OFFLINE",
                newOrder,
                foodsArr: populatedFoodsArr
            });
        } else {
            res.status(403).json({ message: "Unauthorized user role" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching createOrder" });
    }
};

const getAllOrder = async (req, res) => {
    try {
        const getAllOrder = await Order.find({})
        res.status(200).json({ getAllOrder })
    } catch (error) {

    }
}

const inscreaseQuantity = async (req, res) => {
    const idOrderFood = req.params.idOrderFood;  // Assuming ID is in request parameters
    console.log(idOrderFood);
    try {
        // Check if idOrderFood is present and valid
        if (!idOrderFood) {
            return res.status(400).json({ message: "Invalid order food ID" });
        }

        const food = await OrderFood.findById(idOrderFood);
        if (!food) {
            return res.status(404).json({ message: "Order food not found" });
        }
        const existQuanity = food.quantity
        const inscreaseQuantity = await OrderFood.findByIdAndUpdate({ _id: idOrderFood },
            { $set: { quantity: existQuanity++ } },
            { new: true })

        await inscreaseQuantity.save()
        res.status(200).json({ message: "Order food quantity increased successfully" }, food);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error increasing order food quantity" });
    }
};

const updateStatus = async (req, res) => {
    const idOrder = req.params.idOrder
    const newStatus = "Wait for payment";
    try {
        const updateStatus = await Order.findByIdAndUpdate({ _id: idOrder }, { $set: { status: newStatus } }, { new: true })
        res.status(200).json({ updateStatus })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching updateStatus" });
    }
}

const getOneOrder = async (req, res) => {
    const idOrder = req.params.idOrder
    try {
        const getOneOrder = await Order.findById({ _id: idOrder })
        res.status(200).json({ getOneOrder })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching getOneOrder" });
    }
}

// const addFoodToOrder = await OrderFood.create({
//     foodId:,
//     orderId: orderId,
//     quantity,
//     note
// })
// console.log("addFoodToOrder", addFoodToOrder);
// const takeOutFoodDetail = await Food.findById({ _id: foodId })
// console.log("takeOutFoodDetail", takeOutFoodDetail);
// res.status(200).json({ message: "Created order Successfull OFFLINE", newOrder, addFoodToOrder })

//         } else if (user.role === "user") {
//             const newOrder = await Order.create({
//                 userId,
//                 shipAddress,
//                 subTotal,
//                 deliveryFee,
//                 discount,
//                 note,
//             })
//             res.status(200).json({ message: "Created order Successfull ONLINE", newOrder })
//         } else {
//             res.status(401).json({ message: "Error getting user role" })
//         }
//     } catch (error) {
//         console.error("Error:", error);
//         return res.status(500).json({ error: error.message });
//     }
// }



// const createOrderFood = async (req, res) => {
//     const { foodId } = req.body
//     const { orderId } = req.body
//     const { quantity } = req.body
//     const { note } = req.body
//     try {
//         const createOrderFood = await orderFood.create({
//             foodId,
//             orderId,
//             quantity,
//             note

//         })
//         res.status(200).json({ createOrderFood })
//         console.log(createOrderFood)
//     } catch (error) {
//         console.log(error);
//     }
// }


module.exports = { createOrder, getAllOrder, updateStatus, getOneOrder, inscreaseQuantity }