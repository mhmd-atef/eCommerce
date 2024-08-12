import { User } from "../../../database/models/user.models.js"
import { catchError } from "../../middleware/catchError.js"
import { ApiFeatures } from '../../utils/apiFeatures.js'
import { AppError } from "../../utils/appError.js"
import { deleteOne } from "../handlers/handlers.js"



export const addUser=catchError(async(req,res,next)=>{  
  const user=new User(req.body)
  await user.save()
  res.status(201).json({message:"User added successfully",user})
}) 

export const allUsers=catchError(async(req,res,next)=>{

    let apiFeatures= new ApiFeatures(User.find(),req.query)
        .fields().filter().sort().search().pagination()
    
    let totalUsers= await User.countDocuments() ;
    let numberOfPages= Math.ceil( totalUsers / apiFeatures.limit ) || 1;
  
    const users = await apiFeatures.modelQuery;
    
    users || next(new AppError("User not found", 404));
    !users ||
      res.status(200).json({
        totalUsers,
        metadata:{
          pageNumber:apiFeatures.pageNumber ,numberOfPages ,limit:apiFeatures.limit ,nextPage:apiFeatures.nextPage ,prevPage:apiFeatures.prevPage
        }, 
        users 
      });
}) 

export const getUser=catchError(async(req,res,next)=>{
    const user=await User.findById(req.params.id)
    user  || next(new AppError('User not found',404))
    !user || res.status(200).json({message:"User successfully",user})
}) 

export const updateUser=catchError(async(req,res,next)=>{
    const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true})
    user  || next(new AppError( "User not found ",404))
    !user || res.status(200).json({message:"User successfully updated",user})
})  

export const deleteUser=deleteOne(User,'users')
