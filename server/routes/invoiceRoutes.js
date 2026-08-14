import express from 'express';
import { getInvoices, createInvoice, updateInvoice, deleteInvoice } from '../controllers/invoiceController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.route('/').get(getInvoices).post(createInvoice);
router.route('/:id').put(updateInvoice).delete(deleteInvoice);

export default router;
