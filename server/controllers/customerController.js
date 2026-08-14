import Customer from '../models/Customer.js';

// @route GET /api/customers
export const getCustomers = async (req, res) => {
  const customers = await Customer.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(customers);
};

// @route POST /api/customers
export const createCustomer = async (req, res) => {
  const { name, phone, email, address, notes } = req.body;
  const customer = await Customer.create({ userId: req.user.id, name, phone, email, address, notes });
  res.status(201).json(customer);
};

// @route PUT /api/customers/:id
export const updateCustomer = async (req, res) => {
  const customer = await Customer.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!customer) return res.status(404).json({ message: 'Customer not found.' });
  res.json(customer);
};

// @route DELETE /api/customers/:id
export const deleteCustomer = async (req, res) => {
  const customer = await Customer.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!customer) return res.status(404).json({ message: 'Customer not found.' });
  res.json({ message: 'Customer deleted successfully.' });
};
