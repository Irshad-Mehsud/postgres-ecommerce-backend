import Cart from '../models/Cart.js';
import { ApiError } from '../utills/ApiError.js';
import cartItemValidation from '../validations/cartItemValidation.js';
import cartUpdateValidation from '../validations/cartUpdateValidation.js';
import { prisma } from '../config/db.js';
const include = { items: { include: { product: true } } };
const getCart = (userId) => Cart.findUnique({ where: { userId }, include });
const addItem = async (userId, data) => {
    const { error, value } = cartItemValidation.validate(data);
    if (error) throw new ApiError(400, 'Validation error', error.details);
    const cart = await Cart.upsert({ where: { userId }, create: { userId }, update: {} });
    try {
        const product = await prisma.product.findUnique({ where: { id: value.productId } });
        if (!product || !product.isActive) throw new ApiError(404, 'Product not found');
        const existingItem = await prisma.cartItem.findUnique({
            where: { cartId_productId: { cartId: cart.id, productId: value.productId } },
        });
        if (product.stock < value.quantity + (existingItem?.quantity || 0)) throw new ApiError(409, 'Insufficient stock');
        return await Cart.update({ where: { id: cart.id }, data: { items: { upsert: { where: { cartId_productId: { cartId: cart.id, productId: value.productId } }, create: value, update: { quantity: value.quantity } } } }, include });
    } catch (error) { if (error.code === 'P2003') throw new ApiError(400, 'Product not found'); throw error; }
};
const removeItem = async (userId, productId) => {
    const cart = await Cart.findUnique({ where: { userId } });
    if (!cart) throw new ApiError(404, 'Cart not found');
    try { await Cart.update({ where: { id: cart.id }, data: { items: { delete: { cartId_productId: { cartId: cart.id, productId } } } } }); return getCart(userId); }
    catch (error) { if (error.code === 'P2025') throw new ApiError(404, 'Cart item not found'); throw error; }
};
const updateItem = async (userId, productId, data) => {
    const { error, value } = cartUpdateValidation.validate(data);
    if (error) throw new ApiError(400, 'Validation error', error.details);
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.isActive) throw new ApiError(404, 'Product not found');
    if (product.stock < value.quantity) throw new ApiError(409, 'Insufficient stock');
    const cart = await Cart.findUnique({ where: { userId } });
    if (!cart) throw new ApiError(404, 'Cart not found');
    return Cart.update({
        where: { id: cart.id },
        data: { items: { update: { where: { cartId_productId: { cartId: cart.id, productId } }, data: { quantity: value.quantity } } } },
        include,
    }).catch((error) => {
        if (error.code === 'P2025') throw new ApiError(404, 'Cart item not found');
        throw error;
    });
};
export default { getCart, addItem, removeItem, updateItem };
