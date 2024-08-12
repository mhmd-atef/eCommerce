import Joi from "joi";




export const brandValidation=Joi.object(
    {
        name: Joi.string().min(2).max(50).required(),
        logo: Joi.object({
            fieldname:Joi.string().required(),
            originalname:Joi.string().required(),
            encoding:Joi.string().required(),
            destination:Joi.string().required(),
            filename:Joi.string().required(),
            path:Joi.string().required(),
            mimetype:Joi.string().valid('image/jpeg', 'image/png','image/gif', 'image/jpg').required(),
            size:Joi.number().max(1024 * 1024 * 7).required(),
        }),
    }
)