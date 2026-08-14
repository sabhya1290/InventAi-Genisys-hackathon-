import express from 'express';
import { signup, login, getMe, updateMe, changePassword } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.put('/me', authMiddleware, updateMe);
router.put('/change-password', authMiddleware, changePassword);

export default router;
