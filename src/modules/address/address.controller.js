import { User } from "../../../database/models/user.models.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";



export const getAllAddress = catchError(async (req, res, next) => {
  const address=await User.findById(req.user.userId)
  address || next(new AppError("address not found or you are not created this address", 404));
  !address ||res.status(200).json({ message: "address successfully updated", address:address.addresses});
});



export const addToAddress = catchError(async (req, res, next) => {
  const address=await User.findByIdAndUpdate(req.user.userId,
    { $push:{addresses:req.body} },{new:true})
  address || next(new AppError("address not found or you are not created this address", 404));
  !address ||res.status(200).json({ message: "address successfully updated", address:address.addresses});
});


export const removeFromAddress = catchError(async (req, res, next) => {
  const address=await User.findByIdAndUpdate(req.user.userId,
    { $pull:{addresses:{_id:req.params.id}} },{new:true})
  address || next(new AppError("address not found or you are not created this address", 404));
  !address ||res.status(200).json({ message: "address successfully updated", address:address.addresses});
});

