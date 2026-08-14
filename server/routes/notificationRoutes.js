import express from 'express';
import {
  getNotifications,
  markNotificationRead,
  markAllRead,
  deleteNotification,
} from '../controllers/notificationController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getNotifications);
router.put('/mark-all-read', markAllRead);
router.put('/:id/mark-read', markNotificationRead);
router.delete('/:id', deleteNotification);

export default router;
