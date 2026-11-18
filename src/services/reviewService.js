import Review from '../models/Review.js';
import { ApiError } from '../utills/ApiError.js';
import reviewValidation from '../validations/reviewValidation.js';

const createReview = async (userId, data) => {
    const { error, value } = reviewValidation.validate(data);
    if (error) throw new ApiError(400, 'Validation error', error.details);
    try { return await Review.create({ data: { ...value, userId } }); }
    catch (error) { if (error.code === 'P2002') throw new ApiError(409, 'You have already reviewed this product'); if (error.code === 'P2003') throw new ApiError(400, 'Product not found'); throw error; }
};
const getProductReviews = (productId) => Review.findMany({ where: { productId }, include: { user: { select: { id: true, name: true, profileImage: true } } }, orderBy: { createdAt: 'desc' } });
const updateReview = async (userId, id, data) => {
    const { error, value } = reviewValidation.validate(data, { presence: 'optional' });
    if (error) throw new ApiError(400, 'Validation error', error.details);
    try { return await Review.update({ where: { id, userId }, data: value }); }
    catch (error) { if (error.code === 'P2025') throw new ApiError(404, 'Review not found'); throw error; }
};
const deleteReview = async (userId, id) => {
    try { return await Review.delete({ where: { id, userId } }); }
    catch (error) { if (error.code === 'P2025') throw new ApiError(404, 'Review not found'); throw error; }
};
export default { createReview, getProductReviews, updateReview, deleteReview };
