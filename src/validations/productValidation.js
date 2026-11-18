import Joi from 'joi';

export default Joi.object({
    name: Joi.string().trim().min(2).max(200).required(),
    description: Joi.string().trim().required(),
    price: Joi.number().positive().precision(2).required(),
    discountPrice: Joi.number().min(0).precision(2).default(0),
    stock: Joi.number().integer().min(0).default(0),
    categoryId: Joi.string().required(),
    brand: Joi.string().trim().allow(null, ''),
    featured: Joi.boolean().default(false),
    isActive: Joi.boolean().default(true),
});
