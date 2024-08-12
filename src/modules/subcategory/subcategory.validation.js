import Joi from "joi";




export const subcategoryValidation=Joi.object(
    {
        name: Joi.string().min(2).max(50).required(),
        Category:Joi.string().required()
    }
)