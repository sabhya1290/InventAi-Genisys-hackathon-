import express from 'express';
import { getOrders, createOrder, updateOrder, deleteOrder } from '../controllers/orderController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.route('/').get(getOrders).post(createOrder);
router.route('/:id').put(updateOrder).delete(deleteOrder);

export default router;
