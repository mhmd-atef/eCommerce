import { model, Schema, Types } from "mongoose";

// Define the schema

const schema=new Schema({
    title:{
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
    description:{
        type:String,
        required:true,
        minLength:30,
        maxLength:3000
    },
    imageCover:String,
    images: [String],
    price:{
        type: Number,
        required:true,
        min: 0,
    },
    priceAfterDiscount:{
        type: Number,
        required:true,
        min: 0,
    },
    sold:Number,
    stock:{
        type: Number,
        min: 0,
    },
    category:{
        type: Types.ObjectId,
        ref: 'Category',
        required:true
    },
    subcategory:{
        type: Types.ObjectId,
        ref: 'SubCategory',
        required:true
    },
    brand:{
        type: Types.ObjectId,
        ref: 'Brand',
        required:true
    },
    rateAvg:{
        type: Number,
        min: 1,
        max: 5
    },
    rateCount:Number,
    createdBy:{
        type: Types.ObjectId,
        ref:'User'
    }

},{
    timestamps:true,
    toJSON:{virtuals:true},
    id:false,
})


schema.virtual('Reviews',{
    ref:'Review',
    localField:'_id',
    foreignField:'product',
})

schema.pre('findOne',function(){
    this.populate('Reviews')
})



schema.post('init', function(doc) {
    if(this.skipInit){
        next()
    }
    if (doc.imageCover) {
        doc.set('imageCover', `${process.env.BASE_URL}products/${doc.imageCover}`);
    }
    if (doc.images) {
        doc.set('images', doc.images.map(img => `${process.env.BASE_URL}products/${img}`));
    }

});







// Create the model

export const Product=model('Product',schema)
