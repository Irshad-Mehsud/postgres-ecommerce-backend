import Joi from "joi";

const userSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required(),

  email: Joi.string()
    .trim()
    .email()
    .lowercase()
    .required(),

  password: Joi.string()
    .min(8)
    .max(30)
    .required(),

  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]{10,20}$/)
    .allow(null, ""),

  profileImage: Joi.string()
    .uri()
    .allow(null, ""),

  role: Joi.string()
    .valid("customer", "admin")
    .default("customer"),

  isVerified: Joi.boolean().default(false)
});

export default userSchema;