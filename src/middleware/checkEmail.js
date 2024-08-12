import { User } from "../../database/models/user.models.js";
import { AppError } from "../utils/appError.js";


// Implement your code here to check if the email is already registered in the database.
export const checkEmail= async(req,res,next)=>{
    let isFound=await User.findOne({email:req.body.email})
    if(isFound) return next(new AppError('email already exists',409))
    next()
}