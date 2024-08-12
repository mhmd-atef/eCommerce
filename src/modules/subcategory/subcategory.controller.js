import slugify from "slugify"
import { SubCategory } from "../../../database/models/subcategory.models.js"
import { catchError } from "../../middleware/catchError.js"
import { AppError } from "../../utils/appError.js"
import { ApiFeatures } from "../../utils/apiFeatures.js"




export const addSubCategory=catchError(async(req,res,next)=>{
    req.body.slug=slugify(req.body.name)
    const subcategory=new SubCategory(req.body)
    await subcategory.save()
    res.status(201).json({message:"Subcategory added successfully",subcategory})
}) 

export const allSubCategories=catchError(async(req,res,next)=>{
    let filter={}
    if(req.params.category) filter.category=req.params.category

    let apiFeatures= new ApiFeatures(SubCategory.find(filter),req.query)
        .fields().filter().sort().search().pagination()
    
    let totalSubcategories= await SubCategory.countDocuments() ;
    let numberOfPages= Math.ceil( totalSubcategories / apiFeatures.limit ) || 1;
  
    const subcategories = await apiFeatures.modelQuery;
    
    subcategories || next(new AppError("product not found", 404));
    !subcategories ||
      res.status(200).json({
        totalSubcategories,
        metadata:{
          pageNumber:apiFeatures.pageNumber ,numberOfPages ,limit:apiFeatures.limit ,nextPage:apiFeatures.nextPage ,prevPage:apiFeatures.prevPage
        }, 
        subcategories 
      });
}) 

export const getSubCategory=catchError(async(req,res,next)=>{
    const subcategory=await SubCategory.findById(req.params.id)
    subcategory  || next(new AppError('Subcategory not found',404))
    !subcategory || res.status(200).json({message:"Subcategory successfully",subcategory})
}) 

export const updateSubCategory=catchError(async(req,res,next)=>{
    req.body.slug=slugify(req.body.name)
    const subcategory=await SubCategory.findByIdAndUpdate(req.params.id,req.body,{new:true})
    subcategory  || next(new AppError('Subcategory not found',404))
    !subcategory || res.status(200).json({message:"Subcategory successfully",subcategory})
}) 

export const deleteSubCategory=catchError(async(req,res,next)=>{
    const subcategory=await SubCategory.findByIdAndDelete(req.params.id)
    subcategory  || next(new AppError('Subcategory not found',404))
    !subcategory || res.status(200).json({message:"Subcategory successfully",subcategory})
})   