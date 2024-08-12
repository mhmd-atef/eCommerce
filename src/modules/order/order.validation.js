import Joi from "joi";




export const reviewValidation=Joi.object(
    {
        comment: Joi.string().min(2).max(50).required(),
    }
)