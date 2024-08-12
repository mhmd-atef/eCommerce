import { AppError } from "../../utils/appError.js";
import { catchError } from "../../middleware/catchError.js";
import { deleteOne } from "../handlers/handlers.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";
import { Review } from "../../../database/models/review.models.js";

export const addReview = catchError(async (req, res, next) => {
  req.body.user = req.user.userId;
  let isFound= await Review.findOne({user:req.user.userId,product:req.body.product})
  if(isFound) return next(new AppError('You have already reviewed this product',409))

  const review = new Review(req.body);
  await review.save();
  res.status(201).json({ message: "review added successfully", review });
});

export const allReviews = catchError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(Review.find(), req.query) 
    .fields() .filter() .sort() .search() .pagination();

  let totalReviews = await Review.countDocuments();
  let numberOfPages = Math.ceil(totalReviews / apiFeatures.limit) || 1;

  const reviews = await apiFeatures.modelQuery;

  reviews || next(new AppError("review not found", 404));
  !reviews ||
    res.status(200).json({
      totalReviews,
      metadata: {
        pageNumber: apiFeatures.pageNumber,
        numberOfPages,
        limit: apiFeatures.limit,
        nextPage: apiFeatures.nextPage,
        prevPage: apiFeatures.prevPage,
      },
      reviews,
    });
});

export const getReview = catchError(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  review || next(new AppError("review not found", 404));
  !review || res.status(200).json({ message: "review successfully", review });
});

export const updateReview = catchError(async (req, res, next) => {
  const review=await Review.findOneAndUpdate({_id:req.params.id,user:req.user.userId},req.body,{new:true})
  review || next(new AppError("review not found or you are not created this review", 404));
  !review ||res.status(200).json({ message: "review successfully updated", review});
});

export const deleteReview = deleteOne(Review);
