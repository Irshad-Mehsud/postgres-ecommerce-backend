import { ApiError } from '../utills/ApiError.js';
import reviewService from '../services/reviewService.js';
const run = (action, status = 200) => async (req, res, next) => {
    try { res.status(status).json({ success: true, data: await action(req) }); }
    catch (error) { next(error instanceof ApiError ? error : new ApiError(500, 'Review operation failed', error.message)); }
};
export const createReviewController = run((req) => reviewService.createReview(req.user.id, req.body), 201);
export const getProductReviewsController = run((req) => reviewService.getProductReviews(req.params.productId));
export const updateReviewController = run((req) => reviewService.updateReview(req.user.id, req.params.id, req.body));
export const deleteReviewController = run((req) => reviewService.deleteReview(req.user.id, req.params.id));