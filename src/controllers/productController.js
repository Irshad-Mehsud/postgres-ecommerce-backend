import { ApiError } from '../utills/ApiError.js';
import productService from '../services/productService.js';

const run = (action, status = 200) => async (req, res, next) => {
    try {
        res.status(status).json({ success: true, data: await action(req) });
    } catch (error) {
        next(error instanceof ApiError ? error : new ApiError(500, 'Product operation failed', error.message));
    }
};

export const createProductController = run((req) => productService.createProduct(req.body), 201);
export const getAllProductsController = run((req) => productService.getAllProducts(req.query.categoryId ? { categoryId: req.query.categoryId } : {}));
export const getProductByIdController = run((req) => productService.getProductById(req.params.id));
export const updateProductController = run((req) => productService.updateProductById(req.params.id, req.body));
export const deleteProductController = run((req) => productService.deleteProductById(req.params.id));