import Product from '../models/Product.js';
import { ApiError } from '../utills/ApiError.js';
import productValidation from '../validations/productValidation.js';

const include = { category: true, images: true };
const createProduct = async (data) => {
    const { error, value } = productValidation.validate(data);
    if (error) throw new ApiError(400, 'Validation error', error.details);
    try { return await Product.create({ data: value, include }); }
    catch (error) { if (error.code === 'P2003') throw new ApiError(400, 'Category not found'); throw error; }
};
const getAllProducts = (where = {}) => Product.findMany({ where, include, orderBy: { createdAt: 'desc' } });
const getProductById = async (id) => {
    const product = await Product.findUnique({ where: { id }, include });
    if (!product) throw new ApiError(404, 'Product not found');
    return product;
};
const updateProductById = async (id, data) => {
    const { error, value } = productValidation.validate(data, { presence: 'optional' });
    if (error) throw new ApiError(400, 'Validation error', error.details);
    try { return await Product.update({ where: { id }, data: value, include }); }
    catch (error) { if (error.code === 'P2025') throw new ApiError(404, 'Product not found'); if (error.code === 'P2003') throw new ApiError(400, 'Category not found'); throw error; }
};
const deleteProductById = async (id) => {
    try { return await Product.delete({ where: { id } }); }
    catch (error) { if (error.code === 'P2025') throw new ApiError(404, 'Product not found'); throw error; }
};
export default { createProduct, getAllProducts, getProductById, updateProductById, deleteProductById };
