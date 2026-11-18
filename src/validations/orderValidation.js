import Joi from 'joi';
export default Joi.object({
    fullName: Joi.string().trim().min(2).max(100).required(),
    phone: Joi.string().pattern(/^[0-9+\-\s()]{10,20}$/).required(),
    city: Joi.string().trim().min(2).max(100).required(),
    area: Joi.string().trim().min(2).max(100).required(),
    address: Joi.string().trim().min(5).max(500).required(),
    postalCode: Joi.string().trim().max(20).allow(null, ''),
    paymentMethod: Joi.string().valid('COD', 'Stripe', 'PayPal').default('COD'),
});
