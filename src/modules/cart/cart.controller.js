import { Cart } from "../../../database/models/cart.models.js";
import { Coupon } from "../../../database/models/coupon.models.js";
import { Product } from "../../../database/models/product.models.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";




function calcTotalPrice(isCartExist) {
  isCartExist.totalCartPrice=isCartExist.cartItems.reduce((prev,item)=>prev+= item.quantity* item.price,0);
  if(isCartExist.discount){
    isCartExist.totalCartPriceAfterDiscount=isCartExist.totalCartPrice-(isCartExist.totalCartPrice * isCartExist.discount)/100
  }

}

export const addToCart = catchError(async (req, res, next) => {
  let isCartExist=await Cart.findOne({user:req.user.userId})
  let product=await Product.findById(req.body.product).setOptions({skipInit:true}).exec();
  if(!product)return next(new AppError('product not found',404))
  req.body.price= product.price;
  req.body.stock= product.stock;
  

  if(req.body.quantity>product.stock)return next(new AppError('Sold out this quantity',404))
  let remainingQuantity = product.stock - req.body.quantity
  req.body.remainingQuantity =remainingQuantity
  if(remainingQuantity===0)return next(new AppError('Quantity Finished',404))
  // await product.save()



  if(!isCartExist){
    let cart=new Cart({
      user:req.user.userId,
      cartItems:[req.body]
    })
    calcTotalPrice(cart)
    await cart.save()
    res.status(200).json({ message: "cart successfully updated", cart});
  }else{

    let item= isCartExist.cartItems.find(item=>item.product== req.body.product)
    if(item){
      item.quantity += req.body.quantity ||1
      item.remainingQuantity -= req.body.quantity
      if(item.quantity>product.stock)return next(new AppError("Sold out this quantity", 404));
    }

    if(!item) isCartExist.cartItems.push(req.body)
    calcTotalPrice(isCartExist)
    await isCartExist.save()
    res.status(200).json({ message: "success",cart:isCartExist});
  }
});



export const getAllCart = catchError(async (req, res, next) => {
  const cart=await Cart.findOne({user:req.user.userId})
  cart || next(new AppError("cart not found or you are not created this cart", 404));
  !cart ||res.status(200).json({ message: "cart successfully updated", cart});
});


export const updateQuantity = catchError(async (req, res, next) => {
  const cart=await Cart.findOne({user:req.user.userId})
  let item=cart.cartItems.find(item=>item.product== req.params.id)
  if(!item)return next(new AppError("product ot found", 404));
  item.quantity=req.body.quantity
  calcTotalPrice(cart)
  await cart.save();
  res.status(200).json({ message: "product's quantity successfully updated", cart});
});


export const removeFromCart = catchError(async (req, res, next) => {
  const cart=await Cart.findOneAndUpdate({user:req.user.userId},
    { $pull:{cartItems:{_id:req.params.id}} },{new:true})
  cart || next(new AppError("cart not found or you are not created this cart", 404));
  !cart ||res.status(200).json({ message: "Item successfully deleted from cart", cart});
});


export const clearUserCart = catchError(async (req, res, next) => {
  const cart=await Cart.findOneAndDelete({user:req.user.userId})
  cart || next(new AppError("cart not found or you are not created this cart", 404));
  !cart ||res.status(200).json({ message: "Item successfully deleted from cart", cart});
});

export const applyCoupon = catchError(async (req, res, next) => {
  const coupon=await Coupon.findOne({code:req.body.code, expire:{$gte:Date.now()}})
  if(!coupon)return next(new AppError("Opps coupon invalid", 404));

  let cart=await Cart.findOne({user:req.user.userId})
  cart.discount=coupon.discount
  await cart.save()
  res.status(200).json({ message: "successfully ", cart});
});

