
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError.js';



export const verifyToken=async (req,res,next)=>{
    let {token}=req.headers
    jwt.verify(token,process.env.JWT_KEY,async (err,decode)=>{
        if(!err){
            // if token is valid
            req.user=decode
            next()
        }else{  
            next(new AppError("unauthorized",401))
        }
    })
}