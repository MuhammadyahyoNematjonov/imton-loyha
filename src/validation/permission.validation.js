import Joi from "joi";
const permissionSchema = Joi.object({
    user_id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(), 
    transport_id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(), 
    can_create: Joi.boolean(),
    can_read: Joi.boolean(),
    can_delete: Joi.boolean(),
    can_update: Joi.boolean()
});
export default permissionSchema