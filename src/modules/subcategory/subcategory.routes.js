import { Router } from "express";
import { addSubCategory, allSubCategories, deleteSubCategory, getSubCategory, updateSubCategory } from "./subcategory.controller.js";



const subcategoryRouter=Router({mergeParams:true})

//Create SubCategory
subcategoryRouter
.route('/')
.post(addSubCategory)
.get(allSubCategories)

subcategoryRouter
.route('/:id')
.get(getSubCategory)
.put(updateSubCategory)
.delete(deleteSubCategory)




export default subcategoryRouter