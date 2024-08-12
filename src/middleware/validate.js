import { AppError } from "../utils/appError.js";


export const validate=(schema)=>{
    return (req,res,next)=>{
        // if images,image,logo,imageCover are present in request.files then add them to imageValue array.
        // validate the request body with the given schema.
        // if validation fails, return an error with the validation errors.
        // else, move to the next middleware or handler.
        // Note: schema validation is done using joi library.
        // abortEarly: false option allows all validation errors to be returned in an array.
        // Note: req.body, req.params, req.query are automatically validated by joi.
        // Note: req.file is automatically validated by multer.

        // Example usage:
        // const schema=Joi.object({
        //     name: Joi.string().required(),
        //     description: Joi.string().required(),
        //     price: Joi.number().required(),
        //     category: Joi.string().required(),
        //     brand: Joi.string().required(),
        //     quantity: Joi.number().required(),
        //     imageCover: Joi.string().required(),                     
        //     images: Joi.array().items(Joi.string()).required(),
        //     logo: Joi.string().required()
        // })
        let imageValue=[];
        if(req.body.images) imageValue.images=req.files
        if(req.body.imageCover) imageValue.imageCover=req.files
        if(req.body.image) imageValue.image=req.file
        if(req.body.logo) imageValue.logo=req.file
        let{error}=schema.validate({...imageValue,...req.body, ...req.params, ...req.query},{abortEarly:false})
        if(!error){
            next()
        }else{
            let errMsgs=error.details.map(err=>err.message) 
            next(new AppError(errMsgs,401))
        }
    }
}