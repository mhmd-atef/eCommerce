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
    image:String,
    createdBy:{ 
        type: Types.ObjectId,
        ref:'User'
    }
},{timestamps:true})

schema.post('init',(doc)=>{
   if(doc.image) doc.image=process.env.BAS_URL +"categories/"+doc.image
})  


// Create the model

export const Category=model('Category',schema)
