import { Router } from "express";
import { checkEmail } from "../../middleware/checkEmail.js";
import { protectedRoutes, signIn, signup, updatePassword } from "./auth.controller.js";
import { verifyToken } from "../../middleware/verifyToken.js";


const authRouter=Router()

// User Model

authRouter.post('/sign-up',checkEmail,signup)
authRouter.post('/sign-in',signIn)
authRouter.patch('/change-password',verifyToken,updatePassword)
authRouter.patch('/change-password',verifyToken,protectedRoutes)

export default authRouter;
