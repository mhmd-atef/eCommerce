import { Router } from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { addToCart, applyCoupon, clearUserCart, getAllCart, removeFromCart, updateQuantity } from "./cart.controller.js";

const cartRouter = Router();

//Create cart
cartRouter
  .route("/")
  .post(protectedRoutes, allowedTo("user"), addToCart)
  .get(protectedRoutes, allowedTo("user"), getAllCart)
  .delete(protectedRoutes, allowedTo("user", "admin"), clearUserCart)
  
cartRouter
  .route("/:id")
  .put(protectedRoutes, allowedTo("user"), updateQuantity)
  .delete(protectedRoutes, allowedTo("user", "admin"), removeFromCart)
  
cartRouter.post('/apply-coupon',protectedRoutes, allowedTo("user"), applyCoupon)
export default cartRouter;

