import { Router } from "express";
import { uploadSingleFile } from "../../fileUpload/fileUpload.js";
import subcategoryRouter from "../subcategory/subcategory.routes.js";
import { addCategory, allCategories, deleteCategory, getCategory, updateCategory } from "./category.controller.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import {  validate } from "../../middleware/validate.js";
import { categoryValidation } from "./category.validation.js";



const categoryRouter=Router()

//Category Routes

categoryRouter.use('/:category/subcategories',subcategoryRouter)

//Create Category
categoryRouter
.route('/')
.post(protectedRoutes,allowedTo('user','admin','manager'),uploadSingleFile('image','categories'),validate(categoryValidation),addCategory)
.get(allCategories)

categoryRouter
.route('/:id')
.get(getCategory)
.put(protectedRoutes,allowedTo('user','admin'),uploadSingleFile('image','categories'),validate(categoryValidation),updateCategory)
.delete(protectedRoutes,deleteCategory)















export default categoryRouter