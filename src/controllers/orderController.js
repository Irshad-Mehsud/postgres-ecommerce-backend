
import { ApiError } from '../utills/ApiError.js';
import orderService from '../services/orderService.js';
const run = (action, status = 200) => async (req, res, next) => {
    try { res.status(status).json({ success: true, data: await action(req) }); }
    catch (error) { next(error instanceof ApiError ? error : new ApiError(500, 'Order operation failed', error.message)); }
};
export const createOrderController = run((req) => orderService.createOrder(req.user.id, req.body), 201);
export const getOrdersController = run((req) => orderService.getUserOrders(req.user.id));
export const getOrderController = run((req) => orderService.getOrderById(req.user.id, req.params.id));
export const updateOrderStatusController = run((req) => orderService.updateOrderStatus(req.params.id, req.body));
