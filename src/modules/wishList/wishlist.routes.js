import { Router } from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import {
    addTOWishlist,
    getAllWishlists,
    removeFromWishlist
} from "./wishlist.controller.js";

const wishlistRouter = Router();

//Create wishlist
wishlistRouter
  .route("/")
  .patch(protectedRoutes, allowedTo("user"), addTOWishlist)
  .get(protectedRoutes, allowedTo("user"), getAllWishlists);

wishlistRouter
  .route("/:id")
  .delete(protectedRoutes, allowedTo("user", "admin"), removeFromWishlist);

export default wishlistRouter;
