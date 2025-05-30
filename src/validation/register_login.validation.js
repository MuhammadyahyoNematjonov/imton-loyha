import Joi from "joi";

const registerSchema = Joi.object({
    username: Joi.string().min(3).max(255).required(),
    password: Joi.string().min(6).max(255).required(),
    repeat_password: Joi.ref('password'),
    birth_date: Joi.date().required(),
    gender: Joi.string().valid("erkak", "ayol", "boshqa").required(),
    role: Joi.string().valid("super_admin", "admin", "user").default("user"),
    branch_id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).when('role', {
        is: Joi.string().valid('admin', 'user'),
        then: Joi.required(),
        otherwise: Joi.optional()
    })
});

const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});
export default {
    registerSchema,
    loginSchema
}