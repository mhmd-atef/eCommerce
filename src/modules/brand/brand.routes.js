import { Router } from "express";
import { uploadSingleFile } from "../../fileUpload/fileUpload.js";
import { addBrand, allBrands, deleteBrand, getBrand, updateBrand } from "./brand.controller.js";



const brandRouter=Router()

//Create Brand
brandRouter
.route('/')
.post(uploadSingleFile('logo','brands'),addBrand)
.get(allBrands)

brandRouter
.route('/:id')
.get(getBrand)
.put(uploadSingleFile('logo','brands'),updateBrand)
.delete(deleteBrand)















export default brandRouter