import { Router } from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { addToAddress, getAllAddress, removeFromAddress } from "./address.controller.js";

const addressRouter = Router();

//Create address
addressRouter
  .route("/")
  .patch(protectedRoutes, allowedTo("user"), addToAddress)
  .get(protectedRoutes, allowedTo("user"), getAllAddress);

addressRouter
  .route("/:id")
  .delete(protectedRoutes, allowedTo("user", "admin"), removeFromAddress);

export default addressRouter;
