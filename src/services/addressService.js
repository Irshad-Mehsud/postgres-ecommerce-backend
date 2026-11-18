import Address from '../models/Address.js';
import { ApiError } from '../utills/ApiError.js';
import addressValidation from '../validations/addressValidation.js';

const createAddress = async (userId, data) => {
    const { error, value } = addressValidation.validate(data);
    if (error) throw new ApiError(400, 'Validation error', error.details);
    return Address.create({ data: { ...value, userId } });
};
const getAddresses = (userId) => Address.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
const getAddressById = async (userId, id) => {
    const address = await Address.findFirst({ where: { id, userId } });
    if (!address) throw new ApiError(404, 'Address not found');
    return address;
};
const updateAddress = async (userId, id, data) => {
    await getAddressById(userId, id);
    const { error, value } = addressValidation.validate(data, { presence: 'optional' });
    if (error) throw new ApiError(400, 'Validation error', error.details);
    return Address.update({ where: { id }, data: value });
};
const deleteAddress = async (userId, id) => {
    await getAddressById(userId, id);
    return Address.delete({ where: { id } });
};
export default { createAddress, getAddresses, getAddressById, updateAddress, deleteAddress };
