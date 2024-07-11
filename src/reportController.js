const Bill = require('./models/billModel'); // Đảm bảo đường dẫn đúng với file bill model
const getWeeklyReport = async (startDate, endDate) => {
  const bills = await Bill.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    },
    {
      $lookup: {
        from: 'orders',
        localField: 'orderId',
        foreignField: '_id',
        as: 'order'
      }
    },
    {
      $unwind: '$order'
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$order.subTotal' },
        totalProfit: { $sum: '$profit' }
      }
    }
  ]);

  return bills[0] || { totalRevenue: 0, totalProfit: 0 };
};

const getMonthlyReport = async (year, month) => {
  const bills = await Bill.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${year}-${month}-01`),
          $lt: new Date(`${year}-${month + 1}-01`)
        }
      }
    },
    {
      $lookup: {
        from: 'orders',
        localField: 'orderId',
        foreignField: '_id',
        as: 'order'
      }
    },
    {
      $unwind: '$order'
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$order.subTotal' },
        totalProfit: { $sum: '$profit' }
      }
    }
  ]);

  return bills[0] || { totalRevenue: 0, totalProfit: 0 };
};

const getYearlyReport = async (year) => {
  const bills = await Bill.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${year}-01-01`),
          $lt: new Date(`${year + 1}-01-01`)
        }
      }
    },
    {
      $lookup: {
        from: 'orders',
        localField: 'orderId',
        foreignField: '_id',
        as: 'order'
      }
    },
    {
      $unwind: '$order'
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$order.subTotal' },
        totalProfit: { $sum: '$profit' }
      }
    }
  ]);

  return bills[0] || { totalRevenue: 0, totalProfit: 0 };
};

module.exports = { getWeeklyReport, getMonthlyReport, getYearlyReport };
