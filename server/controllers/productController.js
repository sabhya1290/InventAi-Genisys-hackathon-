import Product from '../models/Product.js';
import Notification from '../models/Notification.js';

// @route GET /api/products
export const getProducts = async (req, res) => {
  const products = await Product.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(products);
};

// @route POST /api/products
export const createProduct = async (req, res) => {
  const { name, sku, category, description, purchase_price, selling_price, stock_quantity, reorder_threshold } = req.body;

  const product = await Product.create({
    userId: req.user.id,
    name, sku, category, description,
    purchase_price, selling_price, stock_quantity, reorder_threshold,
  });

  // Auto-notify if low stock on creation
  if (product.status === 'Low Stock' || product.status === 'Out of Stock') {
    await Notification.create({
      userId: req.user.id,
      type: 'alert',
      message: `${product.name} is ${product.status} (${product.stock_quantity} left)`,
    });
  }

  res.status(201).json(product);
};

// @route PUT /api/products/:id
export const updateProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, userId: req.user.id });
  if (!product) return res.status(404).json({ message: 'Product not found.' });

  const prevStatus = product.status;
  Object.assign(product, req.body);
  await product.save();

  // Notify if status degraded
  if (prevStatus === 'In Stock' && (product.status === 'Low Stock' || product.status === 'Out of Stock')) {
    await Notification.create({
      userId: req.user.id,
      type: 'alert',
      message: `${product.name} is now ${product.status} (${product.stock_quantity} left)`,
    });
  }

  res.json(product);
};

// @route DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  const product = await Product.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  res.json({ message: 'Product deleted successfully.' });
};
