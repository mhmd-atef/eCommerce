import { Router } from "express";
import { addCoupon, deleteCoupon, getAllCoupon, getCoupon, updateCoupon } from "./coupon.controller.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

const couponRouter = Router();

couponRouter.use(protectedRoutes, allowedTo("admin"))

//Create coupon
couponRouter
  .route("/")
  .post(addCoupon)
  .get(getAllCoupon);

couponRouter
  .route("/:id")
  .get( getCoupon)
  .put( updateCoupon)
  .delete( deleteCoupon);

export default couponRouter;
