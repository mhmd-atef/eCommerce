import { Router } from "express";
import { checkEmail } from "../../middleware/checkEmail.js";
import { protectedRoutes, signIn, signup, updatePassword } from "./auth.controller.js";
import { verifyToken } from "../../middleware/verifyToken.js";
import { validate } from "../../middleware/validate.js";
import { signInValid, signupValid } from "./auth.validation.js";


const authRouter=Router()

// User Model

authRouter.post('/sign-up',validate(signupValid),checkEmail,signup)
authRouter.post('/sign-in',validate(signInValid),signIn)
authRouter.patch('/change-password',verifyToken,updatePassword)
authRouter.patch('/change-password',verifyToken,protectedRoutes)

export default authRouter;
