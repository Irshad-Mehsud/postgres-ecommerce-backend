import { ApiError } from '../utills/ApiError.js';
import categoryService from '../services/categoryService.js';

const handle = (action, message) => async (req, res, next) => {
    try {
        const data = await action(req);
        res.status(message === 'created' ? 201 : 200).json({ success: true, data });
    } catch (error) {
        next(error instanceof ApiError ? error : new ApiError(500, `Failed to ${message} category`, error.message));
    }
};

export const createCategoryController = handle((req) => categoryService.createCategory(req.body), 'created');
export const getAllCategoriesController = handle(() => categoryService.getAllCategories(), 'retrieve');
export const getCategoryByIdController = handle((req) => categoryService.getCategoryById(req.params.id), 'retrieve');
export const updateCategoryController = handle((req) => categoryService.updateCategoryById(req.params.id, req.body), 'update');
export const deleteCategoryController = handle((req) => categoryService.deleteCategoryById(req.params.id), 'delete');
