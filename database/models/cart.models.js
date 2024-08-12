import { model, Schema, Types } from "mongoose";

// Define the schema


const schema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
    },
    cartItems: [
      {
        product: { type: Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
        price:Number,
        stock:Number,
        remainingQuantity:Number,
      },
    ],
    totalCartPrice:Number,
    discount:Number,
    totalCartPriceAfterDiscount:Number
  },
  { timestamps: true }
);

// Create the model

export const Cart = model("Cart", schema);
