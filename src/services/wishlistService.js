import Wishlist from '../models/Wishlist.js';
import { ApiError } from '../utills/ApiError.js';
const include = { products: { include: { product: true } } };
const getWishlist = (userId) => Wishlist.upsert({ where: { userId }, create: { userId }, update: {}, include });
const addProduct = async (userId, productId) => {
    const wishlist = await Wishlist.upsert({ where: { userId }, create: { userId }, update: {} });
    try { return await Wishlist.update({ where: { id: wishlist.id }, data: { products: { create: { productId } } }, include }); }
    catch (error) { if (error.code === 'P2002') throw new ApiError(409, 'Product is already in wishlist'); if (error.code === 'P2003') throw new ApiError(404, 'Product not found'); throw error; }
};
const removeProduct = async (userId, productId) => {
    const wishlist = await Wishlist.findUnique({ where: { userId } });
    if (!wishlist) throw new ApiError(404, 'Wishlist not found');
    try { await Wishlist.update({ where: { id: wishlist.id }, data: { products: { delete: { wishlistId_productId: { wishlistId: wishlist.id, productId } } } } }); return getWishlist(userId); }
    catch (error) { if (error.code === 'P2025') throw new ApiError(404, 'Wishlist item not found'); throw error; }
};
export default { getWishlist, addProduct, removeProduct };
