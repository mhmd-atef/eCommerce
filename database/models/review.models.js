import { model, Schema, Types } from "mongoose";

// Define the schema

const schema=new Schema({
    comment:String,
    user:{
        type:Types.ObjectId,
        ref:'User'
    },
    product:{
        type:Types.ObjectId,
        ref:'Product'
    },
    rate:{
        type: Number,
        min: 1,
        max: 5
    },
},{timestamps:true})

schema.pre(/^find/,function(){
    this.populate('user product',' name title')
})

// Create the model

export const Review=model('Review',schema)
