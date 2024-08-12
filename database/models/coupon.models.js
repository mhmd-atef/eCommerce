import { model, Schema, Types } from "mongoose";

// Define the schema

const schema=new Schema({
    code:{
        type:String,
        required:true,
        unique:true
    },
    discount:Number,
    expire:Date,

},{timestamps:true})

// Create the model

export const Coupon=model('Coupon',schema)
