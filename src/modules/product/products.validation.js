import Joi from "joi";





const imageSchema = Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),
    mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/gif', 'image/jpg').required(),
    size: Joi.number().max(1024 * 1024 * 7).required(),
});

export const productValidation = Joi.object({
    title: Joi.string().min(2).max(50).required(),
    images: Joi.array().items(imageSchema).min(1),
    imageCover: Joi.string(),
    description: Joi.string().min(30).max(300).required(),
    price: Joi.number().required(),
    priceAfterDiscount: Joi.number(),
    quantity: Joi.number().required(),
    sold: Joi.number().required(),
    stock: Joi.number().required(),
    rateAvg: Joi.number().required(),
    rateCount: Joi.number().required(),
    category: Joi.string().required(),
    subcategory: Joi.string().required(),
    brand: Joi.string().required(),
});
