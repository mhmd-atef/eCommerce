import { User } from "../../../database/models/user.models.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";



export const getAllWishlists = catchError(async (req, res, next) => {
  const wishlist=await User.findById(req.user.userId).populate('wishlist')
  wishlist || next(new AppError("wishlist not found or you are not created this wishlist", 404));
  !wishlist ||res.status(200).json({ message: "wishlist successfully updated", wishlist:wishlist.wishlist});
});



export const addTOWishlist = catchError(async (req, res, next) => {
  const wishlist=await User.findByIdAndUpdate(req.user.userId,
    { $addToSet:{wishlist:req.body.product} },{new:true})
  wishlist || next(new AppError("wishlist not found or you are not created this wishlist", 404));
  !wishlist ||res.status(200).json({ message: "wishlist successfully updated", wishlist:wishlist.wishlist});
});


export const removeFromWishlist = catchError(async (req, res, next) => {
  const wishlist=await User.findByIdAndUpdate(req.user.userId,
    { $pull:{wishlist:req.params.id} },{new:true})
  wishlist || next(new AppError("wishlist not found or you are not created this wishlist", 404));
  !wishlist ||res.status(200).json({ message: "wishlist successfully updated", wishlist:wishlist.wishlist});
});

