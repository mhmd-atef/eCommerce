import fs from 'node:fs'
import path from 'node:path'
import slugify from "slugify"
import { Category } from "../../../database/models/category.models.js"
import { catchError } from "../../middleware/catchError.js"
import { AppError } from "../../utils/appError.js"
import { deleteOne } from '../handlers/handlers.js'
import { ApiFeatures } from '../../utils/apiFeatures.js'


export const addCategory=catchError(async(req,res,next)=>{
    req.body.slug = slugify(req.body.name)
    req.body.image=req.file.filename
    const category=new Category(req.body)
    await category.save()
    res.status(201).json({message:"category added successfully",category})
}) 

export const allCategories=catchError(async(req,res,next)=>{
    let apiFeatures= new ApiFeatures(Category.find(),req.query)
        .fields().filter().sort().search().pagination()
    
    let totalCategories= await Category.countDocuments() ;
    let numberOfPages= Math.ceil( totalCategories / apiFeatures.limit ) || 1;
  
    const categories = await apiFeatures.modelQuery;
    
    categories || next(new AppError("categories not found", 404));
    !categories ||
      res.status(200).json({
        totalCategories,
        metadata:{
          pageNumber:apiFeatures.pageNumber ,numberOfPages ,limit:apiFeatures.limit ,nextPage:apiFeatures.nextPage ,prevPage:apiFeatures.prevPage
        }, 
        categories 
      });
}) 

export const getCategory=catchError(async(req,res,next)=>{
    const category=await Category.findById(req.params.id)
    category  || next(new AppError('category not found',404))
    !category || res.status(200).json({message:"category successfully",category})
}) 

export const updateCategory=catchError(async(req,res,next)=>{
    if(req.body.name) req.body.slug=slugify(req.body.name)
    if(req.file) req.body.image=req.file.filename
    
    
    const category=await Category.findByIdAndUpdate(req.params.id,req.body)
    category  || next(new AppError('category not found',404))
    
    // delete old image from server
    let __filename=fileURLToPath(import.meta.url)
    let __dirname=path.dirname(__filename)
    if (category.image) {
        let oldPath = path.join(__dirname,`../../../uploads/categories/${category.imageCover.split("/").pop()}`);
        fs.unlinkSync(oldPath);
    }
    const newCategory=await Category.findById(req.params.id)
    !category || res.status(200).json({message:"category successfully updated",category:newCategory})
}) 

export const deleteCategory=deleteOne(Category,'categories')

//! let newSplice=filename.slice(3,filename.length).join('/') `/${filename[5]}` *****new idea