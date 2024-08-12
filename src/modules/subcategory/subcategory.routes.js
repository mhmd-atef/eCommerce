import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { addSubCategory, allSubCategories, deleteSubCategory, getSubCategory, updateSubCategory } from "./subcategory.controller.js";
import { subcategoryValidation } from "./subcategory.validation.js";



const subcategoryRouter=Router({mergeParams:true})

//Create SubCategory
subcategoryRouter
.route('/')
.post(validate(subcategoryValidation),addSubCategory)
.get(allSubCategories)

subcategoryRouter
.route('/:id')
.get(getSubCategory)
.put(updateSubCategory)
.delete(deleteSubCategory)




export default subcategoryRouter