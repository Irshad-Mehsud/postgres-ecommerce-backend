import Joi from 'joi';

export const loginValidation = Joi.object({
    email: Joi.string().trim().email().lowercase().required(),
    password: Joi.string().required(),
});
