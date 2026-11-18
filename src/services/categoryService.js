import Category from '../models/Category.js';
import { ApiError } from '../utills/ApiError.js';
import categoryValidation from '../validations/categoryValidation.js';

const createCategory = async (data) => {
    const { error, value } = categoryValidation.validate(data);
    if (error) throw new ApiError(400, 'Validation error', error.details);

    try {
        return await Category.create({ data: value });
    } catch (error) {
        if (error.code === 'P2002') throw new ApiError(409, 'Category already exists');
        throw error;
    }
};

const getAllCategories = () => Category.findMany({ include: { products: true } });

const getCategoryById = async (id) => {
    const category = await Category.findUnique({ where: { id }, include: { products: true } });
    if (!category) throw new ApiError(404, 'Category not found');
    return category;
};

const updateCategoryById = async (id, data) => {
    const { error, value } = categoryValidation.validate(data, { presence: 'optional' });
    if (error) throw new ApiError(400, 'Validation error', error.details);
    try {
        return await Category.update({ where: { id }, data: value });
    } catch (error) {
        if (error.code === 'P2025') throw new ApiError(404, 'Category not found');
        if (error.code === 'P2002') throw new ApiError(409, 'Category already exists');
        throw error;
    }
};

const deleteCategoryById = async (id) => {
    try {
        return await Category.delete({ where: { id } });
    } catch (error) {
        if (error.code === 'P2025') throw new ApiError(404, 'Category not found');
        if (error.code === 'P2003') throw new ApiError(409, 'Category has products and cannot be deleted');
        throw error;
    }
};

export default { createCategory, getAllCategories, getCategoryById, updateCategoryById, deleteCategoryById };
