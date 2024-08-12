import { model, Schema, Types } from "mongoose";

// Define the schema

const schema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User" },
    orderItems: [
      {
        product: { type: Types.ObjectId, ref: "Product" },
        quantity:Number ,
        price: Number,
      },
    ],
    totalOrderPrice: Number,
    shippingAddress: {
      street: String,
      city: String,
      phone: String,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "failed", "paid"],
      default: "pending",
    },
    paymentTypes: {
      type: String,
      enum: ["cash", "online"],
      default: "cash",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: { type: Date },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

// Create the model

export const Order = model("Order", schema);
