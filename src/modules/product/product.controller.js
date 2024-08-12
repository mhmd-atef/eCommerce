import fs from "node:fs";
import path from "node:path";
import slugify from "slugify";
import { Product } from "../../../database/models/product.models.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";
import { deleteOne } from "../handlers/handlers.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";
import { fileURLToPath } from "node:url";

export const addProduct = catchError(async (req, res, next) => {
  // console.log(req.files);
  req.body.slug = slugify(req.body.title);
  req.body.imageCover = req.files.imageCover[0].filename;
  req.body.images = req.files.images.map((img) => img.filename);
  const product = new Product(req.body);
  console.log("Product", product);
  await product.save();
  res.status(201).json({ message: "product added successfully", product });
});

export const allProducts = catchError(async (req, res, next) => {
  
  let apiFeatures= new ApiFeatures(Product.find(),req.query)
  .fields().filter().sort().search().pagination()
  
  let totalProducts= await Product.countDocuments() ;
  let numberOfPages= Math.ceil( totalProducts / apiFeatures.limit ) || 1;

  const products = await apiFeatures.modelQuery;
  
  products || next(new AppError("product not found", 404));
  !products ||
    res.status(200).json({
      totalProducts,
      metadata:{
        pageNumber:apiFeatures.pageNumber ,numberOfPages ,limit:apiFeatures.limit ,nextPage:apiFeatures.nextPage ,prevPage:apiFeatures.prevPage
      }, 
      products 
    });
});

export const getProduct = catchError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  product || next(new AppError("product not found", 404));
  !product ||
    res.status(200).json({ message: "product successfully", product });
});


export const updateProduct = catchError(async (req, res, next) => {
  if (req.body.title) req.body.slug = slugify(req.body.title);
  if (req.files) req.body.imageCover = req.files.imageCover[0].filename;
  if (req.files) req.body.images = req.files.images.map((img) => img.filename);

  const product = await Product.findByIdAndUpdate(req.params.id, req.body);
  // update new image to  server
  const newProduct = await Product.findById(req.params.id);

  product || next(new AppError("Product not found", 404));

  // delete old imageCover from server
  let __filename = fileURLToPath(import.meta.url);
  let __dirname = path.dirname(__filename);
  if (product.imageCover) {
    let oldPath = path.join(__dirname, `../../../uploads/products/${product.imageCover.split("/").pop()}`);
    fs.unlinkSync(oldPath);
  }

  // delete old images from server
  if (product.images) {
    product.images.forEach(async (img) => {
      let oldImg = path.join( __dirname,  `../../../uploads/products/${img.split("/").pop()}`);
      fs.unlinkSync(oldImg);
      
    });
  }

  !product ||
    res
      .status(200)
      .json({ message: "product successfully updated", product: newProduct });
});

export const deleteProduct = deleteOne(Product, "products");

// Delete Images [ ]

export const deleteProducts = catchError(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  product || next(new AppError("product not found", 404));

  product.images.forEach(async (img) => {
    const imgsPath = path.join(
      "D:/Computer/BackEnd/E-Commerce",
      `/uploads/products/${img.split("/")[5]}`
    );
    console.log("imgsPath", imgsPath);
    fs.unlinkSync(imgsPath);
  });

  // const filename=product.imageCover.split('/')
  let imgPath = path.join(
    "D:/Computer/BackEnd/E-Commerce",
    `/uploads/products/${product.imageCover.split("/")[5]}`
  );
  console.log("imgPath", imgPath);
  fs.unlinkSync(imgPath); // delete image and imageCover from server

  // const pathNames=((product.images.map(img=>img.split('/'))).map(img=>img[5])).map(img=>`/uploads/products/${img}`)
  // console.log('pathNames',pathNames);

  !product ||
    res.status(200).json({ message: "product successfully deleted", product });

  // let img =path.join('D:/Computer/BackEnd/E-Commerce',`/uploads/products/${filename[5]}`)
  // fs.unlinkSync(img)          // delete image and imageCover from server
  // let imgs =pathNames.map(img=> path.join('D:/Computer/BackEnd/E-Commerce',img ))
  // console.log('imgs',imgs);
  // const FSsF= imgs.forEach(img=> fs.unlinkSync(img))         // delete images and imageCover from server
  // console.log('FSsF',FSsF );
});
/**
const path = require('path');
const fs = require('fs').promises;
const appRoot = 'D:/Computer/BackEnd/E-Commerce'; // or use an environment variable

//! async function deleteProduct(req, res, next) {
try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
        throw new AppError('product not found', 404);
    }

    await deleteImages(product);
    res.status(200).json({ message: 'product successfully deleted' });
}catch (error) {
        next(error);
    }
}

//! async function deleteImages(product) {
    const imageCoverPath = getProductImagePath(product.imageCover);
    await fs.unlink(imageCoverPath);

    const imagePaths = product.images.map(getProductImagePath);
    await Promise.all(imagePaths.map(fs.unlink));
}

//! function getProductImagePath(imageUrl) {
    const filename = imageUrl.split('/').pop();
    return path.join(appRoot, `/uploads/products/${filename}`);
}


**/

