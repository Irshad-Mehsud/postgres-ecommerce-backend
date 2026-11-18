import Joi from 'joi';

export default Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    image: Joi.string().uri().allow(null, ''),
});
