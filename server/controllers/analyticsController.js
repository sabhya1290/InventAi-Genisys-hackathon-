import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Invoice from '../models/Invoice.js';
import mongoose from 'mongoose';

// @route GET /api/analytics
export const getAnalytics = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);

  // Total revenue & order count
  const revenueAgg = await Order.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$total_amount' },
        totalOrders: { $count: {} },
      },
    },
  ]);

  const { totalRevenue = 0, totalOrders = 0 } = revenueAgg[0] || {};

  // Low stock count
  const lowStockCount = await Product.countDocuments({
    userId,
    $expr: { $lte: ['$stock_quantity', '$reorder_threshold'] },
  });

  // Unpaid invoices
  const unpaidAgg = await Invoice.aggregate([
    { $match: { userId, payment_status: 'Unpaid' } },
    { $group: { _id: null, count: { $count: {} }, total: { $sum: '$total_amount' } } },
  ]);
  const { count: unpaidInvoices = 0, total: unpaidTotal = 0 } = unpaidAgg[0] || {};

  // Top selling products
  const topSellingAgg = await Order.aggregate([
    { $match: { userId } },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.productId',
        totalSold: { $sum: '$items.quantity' },
        totalRevenue: { $sum: '$items.subtotal' },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: { path: '$product', preserveNullAndEmpty: true } },
    {
      $project: {
        name: { $ifNull: ['$product.name', 'Deleted Product'] },
        totalSold: 1,
        totalRevenue: 1,
      },
    },
  ]);

  // Revenue by category
  const categoryRevenueAgg = await Order.aggregate([
    { $match: { userId } },
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'products',
        localField: 'items.productId',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: { path: '$product', preserveNullAndEmpty: true } },
    {
      $group: {
        _id: { $ifNull: ['$product.category', 'Unknown'] },
        revenue: { $sum: '$items.subtotal' },
      },
    },
    { $project: { name: '$_id', revenue: 1, _id: 0 } },
    { $sort: { revenue: -1 } },
  ]);

  // Revenue trend by month (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const revenueTrendAgg = await Order.aggregate([
    { $match: { userId, createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        revenue: { $sum: '$total_amount' },
        orders: { $count: {} },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    {
      $project: {
        _id: 0,
        name: {
          $concat: [
            { $arrayElemAt: [['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], '$_id.month'] },
          ],
        },
        revenue: 1,
        orders: 1,
      },
    },
  ]);

  res.json({
    totalRevenue,
    totalOrders,
    lowStockCount,
    unpaidInvoices,
    unpaidTotal,
    topSelling: topSellingAgg,
    categoryRevenue: categoryRevenueAgg,
    revenueTrend: revenueTrendAgg,
  });
};
