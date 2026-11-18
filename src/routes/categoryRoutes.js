import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import authorizeRole from '../middleware/authrizeRole.js';
import {
    createCategoryController, getAllCategoriesController, getCategoryByIdController,
    updateCategoryController, deleteCategoryController,
} from '../controllers/categoryController.js';

const router = Router();
router.get('/', getAllCategoriesController);
router.get('/:id', getCategoryByIdController);
router.post('/', authMiddleware, authorizeRole(['admin']), createCategoryController);
router.put('/:id', authMiddleware, authorizeRole(['admin']), updateCategoryController);
router.delete('/:id', authMiddleware, authorizeRole(['admin']), deleteCategoryController);
export default router;
