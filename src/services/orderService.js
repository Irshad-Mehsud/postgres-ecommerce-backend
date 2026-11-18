import Order from '../models/Order.js';
import { ApiError } from '../utills/ApiError.js';
import orderValidation from '../validations/orderValidation.js';
import { prisma } from '../config/db.js';
const include = { items: { include: { product: true } } };
const createOrder = async (userId, data) => {
    const { error, value } = orderValidation.validate(data);
    if (error) throw new ApiError(400, 'Validation error', error.details);
    return prisma.$transaction(async (tx) => {
        const cart = await tx.cart.findUnique({
            where: { userId },
            include: { items: { include: { product: true } } },
        });
        if (!cart || cart.items.length === 0) throw new ApiError(400, 'Cart is empty');

        for (const item of cart.items) {
            if (!item.product.isActive) throw new ApiError(409, `Product ${item.product.name} is no longer available`);
            if (item.product.stock < item.quantity) {
                throw new ApiError(409, `Insufficient stock for ${item.product.name}`);
            }
        }

        const totalAmount = cart.items.reduce((total, item) => {
            const price = item.product.discountPrice && Number(item.product.discountPrice) > 0
                ? item.product.discountPrice
                : item.product.price;
            return total + Number(price) * item.quantity;
        }, 0);

        const order = await tx.order.create({
            data: {
                ...value,
                userId,
                totalAmount,
                items: {
                    create: cart.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.discountPrice && Number(item.product.discountPrice) > 0
                            ? item.product.discountPrice
                            : item.product.price,
                    })),
                },
            },
            include,
        });

        for (const item of cart.items) {
            await tx.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } },
            });
        }
        await tx.cart.delete({ where: { id: cart.id } });
        return order;
    });
};
const getUserOrders = (userId) => Order.findMany({ where: { userId }, include, orderBy: { createdAt: 'desc' } });
const getOrderById = async (userId, id) => {
    const order = await Order.findFirst({ where: { id, userId }, include });
    if (!order) throw new ApiError(404, 'Order not found');
    return order;
};
const updateOrderStatus = async (id, data) => {
    const allowedOrderStatuses = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];
    const allowedPaymentStatuses = ['Pending', 'Paid', 'Failed'];
    if (data.orderStatus && !allowedOrderStatuses.includes(data.orderStatus)) throw new ApiError(400, 'Invalid order status');
    if (data.paymentStatus && !allowedPaymentStatuses.includes(data.paymentStatus)) throw new ApiError(400, 'Invalid payment status');
    if (!data.orderStatus && !data.paymentStatus) throw new ApiError(400, 'No status supplied');
    try { return await Order.update({ where: { id }, data: { ...(data.orderStatus && { orderStatus: data.orderStatus }), ...(data.paymentStatus && { paymentStatus: data.paymentStatus }) }, include }); }
    catch (error) { if (error.code === 'P2025') throw new ApiError(404, 'Order not found'); throw error; }
};
export default { createOrder, getUserOrders, getOrderById, updateOrderStatus };
