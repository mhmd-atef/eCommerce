import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../../../database/models/user.models.js'
import { AppError } from '../../utils/appError.js'
import { catchError } from '../../middleware/catchError.js'




export const signup=catchError( async(req,res)=>{
let user =new User(req.body)
    await user.save()
    let token =jwt.sign({userId:user._id,role:user.role,email:user.email, name:user.name},process.env.JWT_KEY)
    // user[0].password=undefined
    res.json({message:'success',user:{user,token}})
})   

export const signIn =catchError( async(req,res,next)=>{
    let user= await User.findOne({email:req.body.email})
    
    if(!user || !bcrypt.compareSync(req.body.password,user.password)){
        return next(new AppError('Invalid email or password',401))
    }
    jwt.sign({ userId: user._id,role:user.role,email:user.email, name:user.name},process.env.JWT_KEY,(err,token)=>{
        res.json({message:'login successful',token})
    })
}) 

export const updatePassword=catchError(async (req,res,next)=>{
    const userId = req.user.userId;  // Get the logged in user's ID
    const { oldPassword, newPassword } = req.body;
    let user = await User.findById(userId);
    if (!user || !bcrypt.compareSync(oldPassword, user.password)) 
        return next(new AppError('Invalid email or password',401));
    if(oldPassword == newPassword) 
        return next(new AppError('Old password and New password should not be same',400));
    user.password = newPassword;
    user.changePasswordAt=Date.now();
    await user.save();  
    let token =jwt.sign({ userId: user._id,role:user.role,email:user.email, name:user.name},process.env.JWT_KEY)
    res.status(200).json({ message: 'Password updated successfully',token });
})

export const protectedRoutes=catchError(async (req,res,next)=>{
    let {token} = req.headers;
    if(!token) return next(new AppError('Token not provided',401))
    let decodedToken = jwt.verify(token,process.env.JWT_KEY);
    if(!decodedToken) return next(new AppError('Invalid token',401))

    let user= await User.findById(decodedToken.userId)
    if(!user) return next(new AppError('User not found',401))

    if(user.changePasswordAt){
        let time= parseInt(user.changePasswordAt.getTime()/1000)
        if(time> decodedToken.iat)return next(new AppError('Expire Token... login again',401))
    }
    req.user = decodedToken
    
    next()  
})


export const allowedTo=(...roles)=>{
    return catchError(async (req,res,next)=>{
        if(!roles.includes(req.user.role)) return next(new AppError('You not authorized to access ',403))
        next()
    }
)}
