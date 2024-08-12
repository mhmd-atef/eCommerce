import { Router } from "express";
import { uploadMixOfFile } from "../../fileUpload/fileUpload.js";
import { addProduct, allProducts, deleteProduct, getProduct, updateProduct } from "./product.controller.js";
import { validate } from "../../middleware/validate.js";
import { productValidation } from "./products.validation.js";



const productRouter=Router()

//Create product
productRouter
.route('/')
.post(uploadMixOfFile([{name:'imageCover',maxCount:1},{name:'images',maxCount:5}],'products'),validate(productValidation),addProduct)
.get(allProducts)

productRouter
.route('/:id')
.get(getProduct)
.put(uploadMixOfFile([{name:'imageCover',maxCount:1},{name:'images',maxCount:5}],'products'),validate(productValidation),updateProduct)
.delete(deleteProduct)















export default productRouter