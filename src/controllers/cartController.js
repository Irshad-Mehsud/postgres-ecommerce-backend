import { ApiError } from '../utills/ApiError.js';
import cartService from '../services/cartService.js';
const run = (action, status = 200) => async (req, res, next) => {
    try { res.status(status).json({ success: true, data: await action(req) }); }
    catch (error) { next(error instanceof ApiError ? error : new ApiError(500, 'Cart operation failed', error.message)); }
};
export const getCartController = run((req) => cartService.getCart(req.user.id));
export const addCartItemController = run((req) => cartService.addItem(req.user.id, req.body), 201);
export const removeCartItemController = run((req) => cartService.removeItem(req.user.id, req.params.productId));
export const updateCartItemController = run((req) => cartService.updateItem(req.user.id, req.params.productId, req.body));