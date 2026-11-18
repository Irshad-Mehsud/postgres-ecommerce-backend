import Joi from 'joi';
export default Joi.object({
    fullName: Joi.string().trim().min(2).required(),
    phone: Joi.string().trim().min(10).max(20).required(),
    country: Joi.string().trim().default('Pakistan'),
    city: Joi.string().trim().required(),
    area: Joi.string().trim().required(),
    postalCode: Joi.string().trim().allow(null, ''),
    address: Joi.string().trim().required(),
});
