const { json } = require("express");
const Order = require("../models/OrderModel")
const Food = require("../models/foodModel")
const OrderFood = require("../models/orderFoodModel")
const User = require("../models/userModel");

const createOrder = async (req, res) => {
    const { userId, tableId, note, status, foods, discount } = req.body;
    const io = req.io;
    console.log("===========", userId, tableId, foods);
    try {
        const user = await User.findOne({ _id: userId });
        let total = 0
        if (user.role === "moderator"||"admin") {
            // order
            const newOrder = await Order.create({
                userId,
                tableId,
                subTotal: total,
                discount,
                note,
                status,
            });
            // add food
            const orderId = newOrder._id.toHexString();
            for (const food of foods) {
                const foodId = food._id
                const test = await OrderFood.findById(foodId)
                total += test
            }
            const addFoodPromises = foods.map(async food => {
                const foodData = await Food.findById(food._id);
                const totalEachFood = foodData.revenue * food.quantity;
                total += totalEachFood;
                return OrderFood.create({
                    foodId: food._id,
                    orderId: orderId,
                    quantity: food.quantity,
                    totalEachFood: totalEachFood,
                    note,
                });
            });
            const foodsArr = await Promise.all(addFoodPromises);
            await Order.findByIdAndUpdate(orderId, { subTotal: total });

            const populatedFoodsArr = await OrderFood.find({ orderId: orderId }).populate('foodId');
            const populatedNewOrder = await Order.find({ tableId: tableId }).populate({
                path: 'userId',
                select: '-password'
            });
            console.log("foodsArr", foodsArr)
            io.to('admin_room').emit('new_order', {
                message: "Table have Order"
            });
            res.status(200).json({
                message: "Created order Successfully OFFLINE",
                newOrder: populatedNewOrder,
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
    const io = req.io;
    try {
        const orders = await Order.find().populate('userId');
        const detailedOrders = await Promise.all(orders.map(async order => {
            const foods = await OrderFood.find({ orderId: order._id }).populate('foodId');
            return {
                ...order.toObject(),
                foods
            };
        }));
        io.emit('all_orders', {
            orders: detailedOrders
        });
        res.status(200).json({
            message: "Fetched all orders successfully",
            orders: detailedOrders
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching orders" });
    }
};

const getOrderFromTable = async (req, res) => {
    const io = req.io;
    const idTable = req.params.idTable
    try {
        const orderFromTable = await Order.find({ tableId: idTable }).populate([
            { path: 'userId' },
            { path: 'tableId' }
        ]);
        const detailedOrders = await Promise.all(orderFromTable.map(async order => {
            const foods = await OrderFood.find({ orderId: order._id }).populate('foodId');
            return {
                ...order.toObject(),
                foods
            };
        }));
        io.emit('order_from_table', {
            getOrderFromTable: detailedOrders
        });
        res.status(200).json({
            message: "Fetched one order from table successfully",
            getOrderFromTable: detailedOrders
        });
        // console.log({ orderFromTable, detailedOrders })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching getOrderFromTable" });
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

const updateOrder = async (res, req) => {
    const idOrder = res.params.idOrder
    const updateOrder = await Order.findOne({ _id: idOrder })
    try {
        const detailedOrders = await Promise.all(orderFromTable.map(async order => {
            const foods = await OrderFood.find({ orderId: order._id }).populate('foodId');
            return {
                ...order.toObject(),
                foods
            };
        }));
        res.status(200).json({
            message: "Fetched one order from table successfully",
            getOrderFromTable: detailedOrders
        });
        console.log({ orderFromTable, detailedOrders })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching getOrderFromTable" });
    }
}

module.exports = { createOrder, getAllOrder, getOrderFromTable, updateStatus, getOneOrder, updateOrder }