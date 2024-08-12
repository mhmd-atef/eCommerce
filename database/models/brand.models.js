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
    logo:String,
    createdBy:{
        type: Types.ObjectId,
        ref:'User'
    }
},{timestamps:true})

schema.post('init',(doc)=>{
   if(doc.logo) doc.logo=process.env.BAS_URL +"brands/"+doc.logo
})

// Create the model

export const Brand=model('Brand',schema)
