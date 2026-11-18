import { ApiError } from '../utills/ApiError.js';
import wishlistService from '../services/wishlistService.js';
import wishlistValidation from '../validations/wishlistValidation.js';
const run = (action, status = 200) => async (req, res, next) => {
    try { res.status(status).json({ success: true, data: await action(req) }); }
    catch (error) { next(error instanceof ApiError ? error : new ApiError(500, 'Wishlist operation failed', error.message)); }
};
export const getWishlistController = run((req) => wishlistService.getWishlist(req.user.id));
export const addWishlistProductController = run((req) => {
    const { error, value } = wishlistValidation.validate(req.body);
    if (error) throw new ApiError(400, 'Validation error', error.details);
    return wishlistService.addProduct(req.user.id, value.productId);
}, 201);
export const removeWishlistProductController = run((req) => wishlistService.removeProduct(req.user.id, req.params.productId));
