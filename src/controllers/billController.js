const { json } = require("express");
const Order = require("../models/OrderModel")
const Food = require("../models/foodModel")
const OrderFood = require("../models/orderFoodModel")
const Bill = require("../models/billModel")
const User = require("../models/userModel");

const createBill = async (req, res) => {
    try {
        const orderFoodOfBill = await OrderFood.find({ orderId: req.body.orderId }).populate('foodId');
        const order = await Order.findById({ _id: req.body.orderId });
        let totalCost = 0
        orderFoodOfBill.forEach(food => {
            totalCost += food.foodId.costPrice * food.quantity
        })
        const profit = order.subTotal - totalCost;
        const newBill = await Bill.create({
            orderId: req.body.orderId,
            paymentMethod: req.body.paymentMethod,
            total: req.body.total,
            profit: profit
        });

        const updateStatusPayment = await Order.findOneAndUpdate(
            { _id: req.body.orderId },
            { statusPayment: true },
            { new: true }
        );

        const populatedBill = await Bill.findById(newBill._id)
            .populate({
                path: 'orderId',
                populate: {
                    path: 'userId tableId',
                }
            });

        const foodOrders = await OrderFood.find({ orderId: req.body.orderId }).populate('foodId');

        const billDetails = {
            bill: populatedBill,
            order: updateStatusPayment,
        };

        res.status(200).json({
            message: "Created Bill Successfully OFFLINE",
            billDetails: billDetails,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating bill" });
    }
}

const getAllBill = async (req, res) => {
    try {
        const bills = await Bill.find().populate('orderId').sort({ createdAt: -1 })
        const detailedBills = await Promise.all(bills.map(async bill => {
            const foodOrderDetail = await Bill.findById(bill._id)
                .populate({
                    path: 'orderId',
                    populate: {
                        path: 'userId tableId',
                    }
                });
            return {
                ...bill.toObject(),
                foodOrderDetail
            }
        }))
        res.status(200).json({
            message: "Fetched all bills successfully",
            getAllBills: detailedBills
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching bills" });
    }
};

const getOneBill = async (req, res) => {
    const idBill = req.params.idBill
    try {
        const getOneBill = await Bill.findById({ _id: idBill }).populate({
            path: 'orderId',
            populate: {
                path: 'userId tableId',
            }
        });
        const foods = await OrderFood.find({ orderId: getOneBill.orderId._id }).populate('foodId');
        const getOneBillDetails = {
            getOneBill, foods
        }
        res.status(200).json({
            message: "Fetched getOneBill successfully",
            getOneBill: getOneBillDetails
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching getOneBill" });
    }
}




module.exports = { createBill, getOneBill, getAllBill }