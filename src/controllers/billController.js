const { json } = require("express");
const Order = require("../models/OrderModel")
const Food = require("../models/foodModel")
const OrderFood = require("../models/orderFoodModel")
const Bill = require("../models/billModel")
const User = require("../models/userModel");

const createBill = async (req, res) => {
    try {
        const newBill = await Bill.create({
            orderId: req.body.orderId,
            paymentMethod: req.body.paymentMethod,
            total: req.body.total,
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
            foods: foodOrders
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
        const bills = await Bill.find().populate('orderId')
        const detailedBills = await Promise.all(bills.map(async bill => {
            const foodOrderDetail = await Bill.findById(bill._id)
                .populate({
                    path: 'orderId',
                    populate: {
                        path: 'userId tableId',
                    }
                });
            return{
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

// const getOrderFromTable = async (req, res) => {
//     const io = req.io;
//     const idTable = req.params.idTable
//     try {
//         const orderFromTable = await Order.find({ tableId: idTable }).populate([
//             { path: 'userId' },
//             { path: 'tableId' }
//         ]);
//         const detailedOrders = await Promise.all(orderFromTable.map(async order => {
//             const foods = await OrderFood.find({ orderId: order._id }).populate('foodId');
//             return {
//                 ...order.toObject(),
//                 foods
//             };
//         }));
//         io.emit('order_from_table', {
//             getOrderFromTable: detailedOrders
//         });
//         res.status(200).json({
//             message: "Fetched one order from table successfully",
//             getOrderFromTable: detailedOrders
//         });
//         // console.log({ orderFromTable, detailedOrders })
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Error fetching getOrderFromTable" });
//     }
// };

// const updateStatus = async (req, res) => {
//     const idOrder = req.params.idOrder
//     const newStatus = "Wait for payment";
//     try {
//         const updateStatus = await Order.findByIdAndUpdate({ _id: idOrder }, { $set: { status: newStatus } }, { new: true })
//         res.status(200).json({ updateStatus })
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Error fetching updateStatus" });
//     }
// }

// const getOneOrder = async (req, res) => {
//     const idOrder = req.params.idOrder
//     try {
//         const getOneOrder = await Order.findById({ _id: idOrder })
//         res.status(200).json({ getOneOrder })

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Error fetching getOneOrder" });
//     }
// }

// // lấy ra id order -> biết được đang ở order nào  find one and update trả về order and (food được update  thêm xóa giảm )
// const updateOrder = async (req, res) => {
//     const idOrder = req.params.idOrder
//     const listIdRemoveFoods = req.body.listIdRemoveFoods
//     const newOrderFoods = req.body.newOrderFoods
//     const listUpdateQuanFoods = req.body.listUpdateQuanFoods
//     const total = req.body.totalOrder

//     try {
//         const oldFoods = await OrderFood.find({ orderId: idOrder })
//         const listOldFoods = oldFoods.map(item => item.foodId._id.toString())
//         const listAddNewFoods = newOrderFoods.filter(item => !listOldFoods.includes(item.foodId._id.toString()))

//         const newFoods = []
//         for (const listAddNewFood of listAddNewFoods) {
//             const addNewFoodToOrder = await OrderFood.create({
//                 foodId: listAddNewFood.foodId._id,
//                 orderId: idOrder,
//                 quantity: listAddNewFood.quantity,
//                 totalEachFood: listAddNewFood.totalEachFood,
//             })
//             newFoods.push(addNewFoodToOrder)
//         }

//         for (const idRemoveFood of listIdRemoveFoods) {
//             await OrderFood.findOneAndDelete({ foodId: idRemoveFood, orderId: idOrder })
//         }

//         let updateFoodsApi = []
//         for (const updateQuanFood of listUpdateQuanFoods) {
//             console.log("updateQuanFood==>", updateQuanFood.quan);
//             const filter = {
//                 orderId: idOrder,
//                 foodId: updateQuanFood.foodInfo._id,
//             };
//             const update = { quantity: updateQuanFood.quan, totalEachFood: updateQuanFood.totalEachFood };
//             const updateFoods = await OrderFood.findOneAndUpdate(filter, update, {
//                 new: true
//             })
//             updateFoodsApi.push(updateFoods)
//         }

//         res.status(200).json({ total, updateFoodsApi, listUpdateQuanFoods, oldFoods, listOldFoods, listAddNewFoods, newFoods, listIdRemoveFoods })
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Fail update updateOrder" });
//     }
// }

// const updateNote = async (req, res) => {
//     const idOrder = req.params.idOrder
//     const note = req.body.note
//     try {
//         const updateNote = await Order.findOneAndUpdate({ _id: idOrder }, { note: note }, {
//             new: true
//         });
//         res.status(200).json({ updateNote })
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Error fetching updateNote " });
//     }
// }
module.exports = { createBill, getAllBill }