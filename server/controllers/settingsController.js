import StoreSetting from '../models/StoreSetting.js';

// @route GET /api/settings
export const getSettings = async (req, res) => {
  const settings = await StoreSetting.findOne({ userId: req.user.id });
  if (!settings) {
    // Auto-create default if missing
    const defaults = await StoreSetting.create({ userId: req.user.id, name: 'My Store', currency: 'INR' });
    return res.json(defaults);
  }
  res.json(settings);
};

// @route PUT /api/settings
export const updateSettings = async (req, res) => {
  const settings = await StoreSetting.findOneAndUpdate(
    { userId: req.user.id },
    req.body,
    { new: true, upsert: true, runValidators: true }
  );
  res.json(settings);
};
