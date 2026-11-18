import Joi from 'joi';
export default Joi.object({ productId: Joi.string().required(), quantity: Joi.number().integer().min(1).required() });
