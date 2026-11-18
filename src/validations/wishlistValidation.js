import Joi from 'joi';
export default Joi.object({
    productId: Joi.string().required(),
});
