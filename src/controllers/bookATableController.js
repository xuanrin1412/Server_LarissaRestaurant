const { json } = require("express");
const BookATable = require("../models/bookATableModel")

const createBookingATable = async (req, res) => {
    console.log("req.body",req.body);
    const userInfo = req.body.userInfo
    const { date, time, totalPerson, space, note, } = req.body.bookingInfo

    
    try {
        if (userInfo) {
            if (!date || !time || !totalPerson || !space ) {
                return res.status(400).json({ message: 'Date, time, numberGuest and chooseSpace are required.' });
            }
            const createBookingATable = await BookATable.create({
                date,
                time,
                totalPerson,
                space,
                note
            })
            const bookingInfo = {
                userInfo: userInfo,
                bookingInfo: createBookingATable
            }
            res.status(200).json({
                message: "Book a table Successfully",
                booking: bookingInfo,
            });
        } else {
            res.status(401).json({
                message: "Please Login to Book Table",
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating bill", error });
    }
}

// try {

//     const orderFoodOfBill = await OrderFood.find({ orderId: req.body.orderId }).populate('foodId');
//     const order = await Order.findById({ _id: req.body.orderId });
//     let totalCost = 0
//     orderFoodOfBill.forEach(food => {
//         totalCost += food.foodId.costPrice * food.quantity
//     })
//     const profit = order.subTotal - totalCost;
//     const newBill = await Bill.create({
//         orderId: req.body.orderId,
//         paymentMethod: req.body.paymentMethod,
//         total: req.body.total,
//         profit: profit
//     });

//     const updateStatusPayment = await Order.findOneAndUpdate(
//         { _id: req.body.orderId },
//         { statusPayment: true },
//         { new: true }
//     );

//     const populatedBill = await Bill.findById(newBill._id)
//         .populate({
//             path: 'orderId',
//             populate: {
//                 path: 'userId tableId',
//             }
//         });

//     const foodOrders = await OrderFood.find({ orderId: req.body.orderId }).populate('foodId');

//     const billDetails = {
//         bill: populatedBill,
//         order: updateStatusPayment,
//     };

//     res.status(200).json({
//         message: "Created Bill Successfully OFFLINE",
//         billDetails: billDetails,
//     });
// } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error creating bill" });
// }
// }

// const getAllBill = async (req, res) => {
//     try {
//         const bills = await Bill.find().populate('orderId')
//         const detailedBills = await Promise.all(bills.map(async bill => {
//             const foodOrderDetail = await Bill.findById(bill._id)
//                 .populate({
//                     path: 'orderId',
//                     populate: {
//                         path: 'userId tableId',
//                     }
//                 });
//             return {
//                 ...bill.toObject(),
//                 foodOrderDetail
//             }
//         }))
//         res.status(200).json({
//             message: "Fetched all bills successfully",
//             getAllBills: detailedBills
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Error fetching bills" });
//     }
// };

// const getOneBill = async (req, res) => {
//     const idBill = req.params.idBill
//     try {
//         const getOneBill = await Bill.findById({ _id: idBill }).populate({
//             path: 'orderId',
//             populate: {
//                 path: 'userId tableId',
//             }
//         });
//         const foods = await OrderFood.find({ orderId: getOneBill.orderId._id }).populate('foodId');
//         const getOneBillDetails = {
//             getOneBill, foods
//         }
//         res.status(200).json({
//             message: "Fetched getOneBill successfully",
//             getOneBill: getOneBillDetails
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Error fetching getOneBill" });
//     }
// }




module.exports = { createBookingATable }