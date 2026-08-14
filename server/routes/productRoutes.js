import express from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.route('/').get(getProducts).post(createProduct);
router.route('/:id').put(updateProduct).delete(deleteProduct);

export default router;
