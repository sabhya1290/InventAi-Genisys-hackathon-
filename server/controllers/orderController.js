import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Notification from '../models/Notification.js';

// @route GET /api/orders
export const getOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user.id })
    .populate('customerId', 'name email phone')
    .sort({ createdAt: -1 });
  res.json(orders);
};

// @route POST /api/orders
export const createOrder = async (req, res) => {
  const { customerId, status, total_amount, items } = req.body;

  const order = await Order.create({
    userId: req.user.id,
    customerId,
    status: status || 'Pending',
    total_amount,
    items,
    order_date: new Date(),
  });

  // Deduct stock if order is Confirmed or Completed
  if (order.status === 'Confirmed' || order.status === 'Completed') {
    await deductStock(req.user.id, items);
  }

  // Notify
  await Notification.create({
    userId: req.user.id,
    type: 'info',
    message: `New order #${order._id.toString().slice(-6).toUpperCase()} created`,
  });

  const populated = await order.populate('customerId', 'name email phone');
  res.status(201).json(populated);
};

// @route PUT /api/orders/:id
export const updateOrder = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
  if (!order) return res.status(404).json({ message: 'Order not found.' });

  const prevStatus = order.status;
  const newStatus = req.body.status;

  order.status = newStatus;
  await order.save();

  // Deduct stock when transitioning from Pending → Confirmed/Completed
  if (
    prevStatus === 'Pending' &&
    (newStatus === 'Confirmed' || newStatus === 'Completed')
  ) {
    await deductStock(req.user.id, order.items);
  }

  const populated = await order.populate('customerId', 'name email phone');
  res.json(populated);
};

// @route DELETE /api/orders/:id
export const deleteOrder = async (req, res) => {
  const order = await Order.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!order) return res.status(404).json({ message: 'Order not found.' });
  res.json({ message: 'Order deleted successfully.' });
};

// Helper: Deduct stock for order items
const deductStock = async (userId, items) => {
  for (const item of items) {
    const product = await Product.findOne({ _id: item.productId, userId });
    if (product) {
      product.stock_quantity = Math.max(0, product.stock_quantity - item.quantity);
      await product.save();

      if (product.status === 'Low Stock' || product.status === 'Out of Stock') {
        await Notification.create({
          userId,
          type: 'alert',
          message: `${product.name} is now ${product.status} (${product.stock_quantity} left)`,
        });
      }
    }
  }
};
