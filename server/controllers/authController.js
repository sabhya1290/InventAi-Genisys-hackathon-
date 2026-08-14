import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import StoreSetting from '../models/StoreSetting.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @route   POST /api/auth/signup
export const signup = async (req, res) => {
  const { name, email, password, phone, storeName } = req.body;

  if (!name || !email || !password || !storeName) {
    return res.status(400).json({ message: 'Please fill all required fields.' });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'An account with this email already exists.' });
  }

  const user = await User.create({ name, email, password, phone, storeName, role: 'admin' });

  // Create default store settings for this user
  await StoreSetting.create({
    userId: user._id,
    name: storeName,
    currency: 'INR',
    address: '',
    gst: '',
  });

  const token = generateToken(user._id.toString());

  res.status(201).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      storeName: user.storeName,
      role: user.role,
    },
  });
};

// @route   POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password.' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = generateToken(user._id.toString());

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      storeName: user.storeName,
      role: user.role,
    },
  });
};

// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }
  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    storeName: user.storeName,
    role: user.role,
  });
};

// @route   PUT /api/auth/me
export const updateMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found.' });

  const { name, phone } = req.body;
  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;

  await user.save();
  res.json({ id: user._id, name: user.name, email: user.email, phone: user.phone, storeName: user.storeName, role: user.role });
};

// @route   PUT /api/auth/change-password
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) return res.status(404).json({ message: 'User not found.' });

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect.' });

  user.password = newPassword;
  await user.save();

  res.json({ message: 'Password changed successfully.' });
};
