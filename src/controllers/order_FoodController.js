const { json } = require("express");
const Order = require("../models/OrderModel")
const Food = require("../models/foodModel")
const OrderFood = require("../models/orderFoodModel")
const User = require("../models/userModel");
const Table = require("../models/tableModel");

const createOrder = async (req, res) => {
    const { userId, tableId, note, statusPayment, foods, discount } = req.body;
    const io = req.io;
    console.log("===========", userId, tableId, foods, note);
    try {
        const user = await User.findOne({ _id: userId });
        let total = 0
        if (user.role === "moderator" || "admin") {
            // order
            const newOrder = await Order.create({
                userId,
                tableId,
                subTotal: total,
                discount,
                note,
                statusPayment,
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
                });
            });
            console.log("addFoodPromises================================================", addFoodPromises);

            const foodsArr = await Promise.all(addFoodPromises);
            await Order.findByIdAndUpdate(orderId, { subTotal: total });

            const populatedFoodsArr = await OrderFood.find({ orderId: orderId }).populate('foodId');
            const populatedNewOrder = await Order.find({ tableId: tableId }).populate({
                path: 'userId',
                select: '-password'
            });
            console.log("foodsArr", foodsArr)

            const table = await Table.findById({_id:tableId})
            const tableName = table.tableName
            // console.log("table=>",table.tableName);
            
            io.emit('new_order', {
                message: tableName + " have Order"
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
        const orders = await Order.find({ statusPayment: false }).populate('userId');
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

// lấy ra id order -> biết được đang ở order nào  find one and update trả về order and (food được update  thêm xóa giảm )
const updateOrder = async (req, res) => {
    const io = req.io;
    const idOrder = req.params.idOrder
    const listIdRemoveFoods = req.body.listIdRemoveFoods
    const newOrderFoods = req.body.newOrderFoods
    const listUpdateQuanFoods = req.body.listUpdateQuanFoods
    const total = req.body.totalOrder

    try {
        const oldFoods = await OrderFood.find({ orderId: idOrder })
        const listOldFoods = oldFoods.map(item => item.foodId._id.toString())
        const listAddNewFoods = newOrderFoods.filter(item => !listOldFoods.includes(item.foodId._id.toString()))

        const newFoods = []
        for (const listAddNewFood of listAddNewFoods) {
            const addNewFoodToOrder = await OrderFood.create({
                foodId: listAddNewFood.foodId._id,
                orderId: idOrder,
                quantity: listAddNewFood.quantity,
                totalEachFood: listAddNewFood.totalEachFood,
            })
            newFoods.push(addNewFoodToOrder)
        }

        for (const idRemoveFood of listIdRemoveFoods) {
            await OrderFood.findOneAndDelete({ foodId: idRemoveFood, orderId: idOrder })
        }

        let updateFoodsApi = []
        for (const updateQuanFood of listUpdateQuanFoods) {
            console.log("updateQuanFood==>", updateQuanFood.quan);
            const filter = {
                orderId: idOrder,
                foodId: updateQuanFood.foodInfo._id,
            };
            const update = { quantity: updateQuanFood.quan, totalEachFood: updateQuanFood.totalEachFood };
            const updateFoods = await OrderFood.findOneAndUpdate(filter, update, {
                new: true
            })
            updateFoodsApi.push(updateFoods)
        }
        io.emit('new_order', {
            message: "Table have Order"
        });
        res.status(200).json({ total, updateFoodsApi, listUpdateQuanFoods, oldFoods, listOldFoods, listAddNewFoods, newFoods, listIdRemoveFoods })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Fail update updateOrder" });
    }
}

const getBestSellingDishes = async (req, res) => {
    try {
        const bestSellingDishes = await OrderFood.aggregate([
            {
                $group: {
                    _id: "$foodId",
                    totalSold: { $sum: "$quantity" } // Tổng số lượng bán ra
                }
            },
            {
                $sort: { totalSold: -1 } // Sắp xếp theo tổng số lượng bán ra giảm dần
            },
            // {
            //     $limit: 15 // Lấy top 10 món ăn bán chạy nhất
            // },
            {
                $lookup: {
                    from: 'foods', // Tên collection foods
                    localField: '_id',
                    foreignField: '_id',
                    as: 'foodDetails'
                }
            },
            {
                $unwind: "$foodDetails" // Trải phẳng mảng foodDetails để lấy thông tin món ăn
            },
            {
                $project: {
                    _id: 0,
                    foodId: "$_id",
                    foodName: "$foodDetails.foodName",
                    picture: "$foodDetails.picture",
                    totalSold: 1 // Giữ lại giá trị của totalSold từ giai đoạn trước
                }
            }
        ]);

        res.status(200).json({
            message: "Best Selling Dishes Retrieved Successfully",
            bestSellingDishes: bestSellingDishes
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving best-selling dishes" });
    }
};

const updateNote = async (req, res) => {
    const idOrder = req.params.idOrder
    const note = req.body.note
    try {
        const updateNote = await Order.findOneAndUpdate({ _id: idOrder }, { note: note }, {
            new: true
        });
        res.status(200).json({ updateNote })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching updateNote " });
    }
}
module.exports = { createOrder, getAllOrder, getOrderFromTable,getBestSellingDishes, updateStatus, getOneOrder, updateOrder, updateNote }