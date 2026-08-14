import Notification from '../models/Notification.js';

// @route GET /api/notifications
export const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(notifications);
};

// @route PUT /api/notifications/:id/mark-read
export const markNotificationRead = async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { status: 'read' },
    { new: true }
  );
  if (!notification) return res.status(404).json({ message: 'Notification not found.' });
  res.json(notification);
};

// @route PUT /api/notifications/mark-all-read
export const markAllRead = async (req, res) => {
  await Notification.updateMany({ userId: req.user.id, status: 'unread' }, { status: 'read' });
  res.json({ message: 'All notifications marked as read.' });
};

// @route DELETE /api/notifications/:id
export const deleteNotification = async (req, res) => {
  const notification = await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!notification) return res.status(404).json({ message: 'Notification not found.' });
  res.json({ message: 'Notification deleted.' });
};
