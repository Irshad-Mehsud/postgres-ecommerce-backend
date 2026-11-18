import Joi from 'joi';
export default Joi.object({ productId: Joi.string().required(), rating: Joi.number().integer().min(1).max(5).required(), comment: Joi.string().trim().max(1000).allow(null, '') });
