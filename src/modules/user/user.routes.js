import { Router } from "express";
import { checkEmail } from "../../middleware/checkEmail.js";
import { addUser, allUsers, deleteUser, getUser, updateUser } from "./user.controller.js";
import orderRouter from "../order/order.routes.js";



const userRouter=Router()

userRouter.use('/:user/orders',orderRouter)

//Create Brand
userRouter
    .route('/')
    .post(checkEmail,addUser)
    .get(allUsers)

userRouter
    .route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser)



export default userRouter