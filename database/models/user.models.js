import { model, Schema,Types } from "mongoose";
import bcrypt from 'bcrypt'
// Define the schema

const schema=new Schema({
    name:String,
    email:String,
    password:String,
    isBlocked:{
        type:Boolean,
        default: false
    },
    role:{
        type: String,
        enum: ['user', 'admin','manager'],
        default: 'user'
    },
    changePasswordAt:Date,
    wishlist:[
        {
            type:Types.ObjectId,
            ref:"Product"
        }
    ],
    addresses:[
        {
            country:String,
            city:String,
            street:String,
            phone:String 
        }
    ]
},{timestamps:true})


schema.pre('save',function(){
    this.password=bcrypt.hashSync(this.password,8)
})

schema.pre('findOneAndUpdate',function (){
    if(this._update.password) this._update.password=bcrypt.hashSync(this._update.password,8)

})

// schema.methods.comparePassword=async function(candidatePassword){
//     return bcrypt.compareSync(candidatePassword,this.password)
// }



// Create the model

export const User=model('User',schema)
