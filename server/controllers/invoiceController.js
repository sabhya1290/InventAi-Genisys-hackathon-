import Invoice from '../models/Invoice.js';
import Order from '../models/Order.js';

// @route GET /api/invoices
export const getInvoices = async (req, res) => {
  const invoices = await Invoice.find({ userId: req.user.id })
    .populate('orderId', 'status total_amount order_date')
    .sort({ createdAt: -1 });
  res.json(invoices);
};

// @route POST /api/invoices  — generate invoice from orderId
export const createInvoice = async (req, res) => {
  const { orderId, payment_method } = req.body;

  const order = await Order.findOne({ _id: orderId, userId: req.user.id });
  if (!order) return res.status(404).json({ message: 'Order not found.' });

  // Check if invoice already exists for this order
  const existing = await Invoice.findOne({ orderId, userId: req.user.id });
  if (existing) return res.status(400).json({ message: 'Invoice already exists for this order.' });

  const invoice = await Invoice.create({
    userId: req.user.id,
    orderId,
    total_amount: order.total_amount,
    payment_status: 'Unpaid',
    payment_method: payment_method || 'N/A',
    invoice_date: new Date(),
  });

  const populated = await invoice.populate('orderId', 'status total_amount order_date');
  res.status(201).json(populated);
};

// @route PUT /api/invoices/:id  — mark paid or update payment
export const updateInvoice = async (req, res) => {
  const invoice = await Invoice.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true, runValidators: true }
  ).populate('orderId', 'status total_amount order_date');

  if (!invoice) return res.status(404).json({ message: 'Invoice not found.' });
  res.json(invoice);
};

// @route DELETE /api/invoices/:id
export const deleteInvoice = async (req, res) => {
  const invoice = await Invoice.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!invoice) return res.status(404).json({ message: 'Invoice not found.' });
  res.json({ message: 'Invoice deleted successfully.' });
};
