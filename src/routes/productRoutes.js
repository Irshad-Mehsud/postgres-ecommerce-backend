import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import authorizeRole from '../middleware/authrizeRole.js';
import { createProductController, getAllProductsController, getProductByIdController, updateProductController, deleteProductController } from '../controllers/productController.js';

const router = Router();
router.get('/', getAllProductsController);
router.get('/:id', getProductByIdController);
router.post('/', authMiddleware, authorizeRole(['admin']), createProductController);
router.put('/:id', authMiddleware, authorizeRole(['admin']), updateProductController);
router.delete('/:id', authMiddleware, authorizeRole(['admin']), deleteProductController);
export default router;
