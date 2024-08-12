import { Router } from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { checkoutSession, createCashOrder, getAllOrder, getUserOrders } from "./order.controller.js";

const orderRouter = Router({mergeParams:true});

//Create order
orderRouter
  .route("/")
  .get(protectedRoutes, allowedTo( "admin"), getAllOrder);

orderRouter.get("/users", protectedRoutes, allowedTo("user"), getUserOrders);
orderRouter
.route("/:id")
.post(protectedRoutes, allowedTo("user"), createCashOrder);
orderRouter.post("/checkout/:id", protectedRoutes, allowedTo("user"), checkoutSession);

export default orderRouter;
