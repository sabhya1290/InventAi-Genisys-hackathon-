import express from 'express';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../controllers/customerController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.route('/').get(getCustomers).post(createCustomer);
router.route('/:id').put(updateCustomer).delete(deleteCustomer);

export default router;
