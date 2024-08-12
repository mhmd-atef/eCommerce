import Stripe from "stripe";
import { Cart } from "../../../database/models/cart.models.js";
import { Order } from "../../../database/models/order.models .js";
import { Product } from "../../../database/models/product.models.js";
import { User } from "../../../database/models/user.models.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";

const stripe = new Stripe(process.env.STRIPE_KEY);

export const createCashOrder = catchError(async (req, res, next) => {
  //*1- get user cart by cartId
  let cart = await Cart.findById(req.params.id);
  if (!cart) return next(new AppError("Cart not found", 404));

  //*2- total order price
  let totalOrderPrice = cart.totalCartPriceAfterDiscount || cart.totalCartPrice;

  //*3- create order
  let order = new Order({
    user: req.user.userId,
    orderItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });
  await order.save();

  //*4- increment sold & decrement stock
  // cart.cartItems.forEach(async (item) => {
  //   let product = await Product.findById(item.product);
  //   product.sold += item.quantity;
  //   product.stock -= item.quantity;
  //   await product.save();
  // });
  let options = cart.cartItems.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod.product },
        update: { $inc: { sold: prod.quantity, stock: -prod.quantity } },
      },
    };
  });
  await Product.bulkWrite(options);
  // await Product.bulkWrite[
  //   cart.cartItems.map((item) => ({
  //     updateOne: {
  //       filter: { _id: item.product },
  //       update: { $inc: { sold: item.quantity, stock: -item.quantity } },
  //     },
  //   }))
  // ];

  //*5- clear user cart
  await Cart.findByIdAndDelete(cart._id);
  res.status(201).json({ message: "order added successfully", order });
});

//users/id/orders  =>url
export const getUserOrders = catchError(async (req, res, next) => {
  let filter = {};
  if (req.params.user) filter.user = req.params.user;
  const orders = await Order.findOne({ user: req.user.userId }).populate(
    "orderItems.product"
  );
  res.status(200).json({ message: "order successfully", orders });
});

export const getAllOrder = catchError(async (req, res, next) => {
  const orders = await Order.find();
  res.status(200).json({ message: "order successfully", orders });
});

export const checkoutSession = catchError(async (req, res, next) => {
  let cart = await Cart.findById(req.params.id);
  if (!cart) return next(new AppError("Cart not found", 404));
  let totalOrderPrice = cart.totalCartPriceAfterDiscount || cart.totalCartPrice;

  let session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          unit_amount: totalOrderPrice * 100,
          product_data: {
            name: req.user.name,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "http://localhost:3000/success.html",
    cancel_url: "http://localhost:3000/cancel.html",
    customer_email: req.user.email,
    client_reference_id: req.params.id,
    metadata: req.body.shippingAddress,
  });

  res.status(200).json({ message: "checkout session successfully", session });
});

export const checkoutSessionCompleted = catchError(async (req, res, next) => {
  const endpointSecret = "whsec_kyIDiTPMQXxSvFOS9ixjyH7NsQuIW6uC";

  const sig = req.headers["stripe-signature"].toString();

  let event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  // Handle the event
  let checkoutCompleted;
  if (event.type === "checkout.session.completed") {
    checkoutCompleted = event.data.object;
    let user = await User.findOne({ email: checkoutCompleted.email });
    let cart = await Cart.findById(checkoutCompleted.client_reference_id);
    if (!cart) return next(new AppError("Cart not found", 404));

    let order = new Order({
      user: user._id,
      orderItems: cart.cartItems,
      shippingAddress: checkoutCompleted.metadata,
      totalOrderPrice: checkoutCompleted.amount_total / 100,
      paymentId: checkoutCompleted.payment_intent,
      paymentStatus: checkoutCompleted.payment_status,
      paymentType: "card",
      isPaid: true,
    });
    await order.save();

    //*4- increment sold & decrement stock
    let options = cart.cartItems.map((prod) => {
      return {
        updateOne: {
          filter: { _id: prod.product },
          update: { $inc: { sold: prod.quantity, stock: -prod.quantity } },
        },
      };
    });
    await Product.bulkWrite(options);

    //*5- clear user cart
    await Cart.findByIdAndDelete(cart._id);
  }

  res
    .status(200)
    .json({ message: "checkout session successfully", checkoutCompleted });
});
