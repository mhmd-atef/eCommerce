import { Router } from "express";
import { uploadSingleFile } from "../../fileUpload/fileUpload.js";
import { addBrand, allBrands, deleteBrand, getBrand, updateBrand } from "./brand.controller.js";
import { validate } from "../../middleware/validate.js";
import { brandValidation } from "./brand.validation.js";



const brandRouter=Router()

//Create Brand
brandRouter
.route('/')
.post(uploadSingleFile('logo','brands'),validate(brandValidation),addBrand)
.get(allBrands)

brandRouter
.route('/:id')
.get(getBrand)
.put(uploadSingleFile('logo','brands'),validate(brandValidation),updateBrand)
.delete(deleteBrand)















export default brandRouter