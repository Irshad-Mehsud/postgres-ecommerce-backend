import { ApiError } from '../utills/ApiError.js';
import addressService from '../services/addressService.js';
const run = (action, status = 200) => async (req, res, next) => {
    try { res.status(status).json({ success: true, data: await action(req) }); }
    catch (error) { next(error instanceof ApiError ? error : new ApiError(500, 'Address operation failed', error.message)); }
};
export const createAddressController = run((req) => addressService.createAddress(req.user.id, req.body), 201);
export const getAddressesController = run((req) => addressService.getAddresses(req.user.id));
export const getAddressController = run((req) => addressService.getAddressById(req.user.id, req.params.id));
export const updateAddressController = run((req) => addressService.updateAddress(req.user.id, req.params.id, req.body));
export const deleteAddressController = run((req) => addressService.deleteAddress(req.user.id, req.params.id));
