import { model, Schema, Types } from "mongoose";

// Define the schema

const schema=new Schema({
    name:{
        type: String,
        unique:[true,'name is required'],
        trim:true,
        required:true,
        minLength:[2,'too short category name']
    }, 
    slug:{
        type: String,
        unique:[true,'slug is required'],
        lowercase:true,
        required:true,
    },
    category:{
        type:Types.ObjectId,
        ref:'Category'
    },
    createdBy:{
        type: Types.ObjectId,
        ref:'User'
    }
},{timestamps:true})

// Create the model

export const SubCategory=model('SubCategory',schema)
