import Joi from 'joi';
export default Joi.object({
    quantity: Joi.number().integer().min(1).required(),
});
