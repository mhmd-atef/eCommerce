import { Coupon } from "../../../database/models/coupon.models.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";
import { deleteOne } from "../handlers/handlers.js";



export const getAllCoupon = catchError(async (req, res, next) => {
  const coupons=await Coupon.find()
  coupons || next(new AppError("coupons not found ", 404));
  !coupons ||res.status(200).json({ message: "coupons successfully updated", coupons});
});


export const getCoupon = catchError(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);
  coupon || next(new AppError("coupon not found", 404));
  !coupon || res.status(200).json({ message: "coupon successfully", coupon });
});


export const addCoupon = catchError(async (req, res, next) => {
  let isFound=await Coupon.findOne({code:req.body.code})
  if(isFound) return next(new AppError('coupon already found',409))
  let coupon = new Coupon(req.body);
  await coupon.save();
  res.status(201).json({ message: "coupon added successfully", coupon });
});


export const updateCoupon = catchError(async (req, res, next) => {
  const coupon=await Coupon.findByIdAndUpdate(req.params.id,req.body,{new:true})
  coupon || next(new AppError("coupon not found", 404));
  !coupon ||res.status(200).json({ message: "coupon successfully updated", coupon});
});

export const deleteCoupon = deleteOne(Coupon);
