import fs from "node:fs";
import path from "node:path";
import slugify from "slugify";
import { AppError } from "../../utils/appError.js";
import { catchError } from "../../middleware/catchError.js";
import { Brand } from "../../../database/models/brand.models.js";
import { deleteOne } from "../handlers/handlers.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";

export const addBrand = catchError(async (req, res, next) => {
  req.body.slug = slugify(req.body.name);
  req.body.logo = req.file.filename;
  const brand = new Brand(req.body);
  await brand.save();
  res.status(201).json({ message: "Brand added successfully", brand });
});

export const allBrands = catchError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(Brand.find(), req.query) 
    .fields() .filter() .sort() .search() .pagination();

  let totalBrands = await Brand.countDocuments();
  let numberOfPages = Math.ceil(totalBrands / apiFeatures.limit) || 1;

  const brands = await apiFeatures.modelQuery;

  brands || next(new AppError("product not found", 404));
  !brands ||
    res.status(200).json({
      totalBrands,
      metadata: {
        pageNumber: apiFeatures.pageNumber,
        numberOfPages,
        limit: apiFeatures.limit,
        nextPage: apiFeatures.nextPage,
        prevPage: apiFeatures.prevPage,
      },
      brands,
    });
});

export const getBrand = catchError(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);
  brand || next(new AppError("Brand not found", 404));
  !brand || res.status(200).json({ message: "Brand successfully", brand });
});

export const updateBrand = catchError(async (req, res, next) => {
  if (req.body.name) req.body.slug = slugify(req.body.name);
  if (req.file) req.body.logo = req.file.filename;

  const brand=await Brand.findByIdAndUpdate(req.params.id,req.body)
  brand || next(new AppError("Brand not found", 404));

  // delete old logo from server
  let __filename = fileURLToPath(import.meta.url);
  let __dirname = path.dirname(__filename);
  if (brand.logo) {
    let oldPath = path.join( __dirname,`../../../uploads/brands/${brand.logo.split("/").pop()}` );
    fs.unlinkSync(oldPath);
  }
  const newBrand = await Brand.findById(req.params.id);
  !brand ||res.status(200).json({ message: "brand successfully updated", brand: newBrand });
});

export const deleteBrand = deleteOne(Brand, "brands");
