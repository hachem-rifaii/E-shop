const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const Order = require("../model/order");
const Product = require("../model/product");
const shop = require("../model/shop");

// create new order
router.post(
  "/create-order",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;

      //   group cart items by shopId
      const shopItemsMap = new Map();

      for (const item of cart) {
        const shopId = item.shopId;
        if (!shopItemsMap.has(shopId)) {
          shopItemsMap.set(shopId, []);
        }
        shopItemsMap.get(shopId).push(item);
      }

      // create an order for each shop
      const orders = [];

      for (const [shopId, items] of shopItemsMap) {
        const order = await Order.create({
          cart: items,
          shippingAddress,
          user,
          totalPrice,
          paymentInfo,
        });
        orders.push(order);
      }

      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//all orders                    --- user
router.get(
  "/get-all-orders/:userId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find({ "user._id": req.params.userId }).sort({
        createdAt: -1,
      });
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//all orders                    --- seller
router.get(
  "/get-all-orders-by-seller/:shopId",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find({
        "cart.shopId": req.params.shopId,
      }).sort({
        createdAt: -1,
      });
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update order status for seller
router.put(
  "/update-order-status/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return next(new ErrorHandler("Order not found", 404));
      }
      if (req.body.status === "Transferred to delivery partner") {
        order.cart.forEach(async (item) => {
          await updateProduct(item._id, item.qty);
        });
      }
      order.status = req.body.status;

      if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
        order.paymentInfo.status = "succeeded";
        const serviceCharge = order.totalPrice * .10;
        await updateSellerInfo(order.totalPrice - serviceCharge)
      }
      await order.save({ validateBeforeSave: false });
      res.status(200).json({ success: true, order });

      async function updateProduct(id, qty) {
        const product = await Product.findById(id);
        if (!product) {
          return next(new ErrorHandler("Product not found", 404));
        }
        product.stock -= qty;
        product.sold_out += qty;
        await product.save({ validateBeforeSave: false });
      }
      async function updateSellerInfo(amount) {
        const seller = await shop.findById(req.seller.id);
        if (!seller) {
          return next(new ErrorHandler("seller doesn't exists", 400));
        }
        seller.availableBalance = amount;
        await seller.save();
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
// update refund order status  --- user
router.put(
  "/order-refund/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return next(new ErrorHandler("Order not found", 404));
      }
      order.status = req.body.status;
      await order.save({ validateBeforeSave: false });
      res.status(200).json({
        success: true,
        order,
        message: "Refund order status updated successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// accpet the refund          --- seller
router.put(
  "/accept-refund/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return next(new ErrorHandler("Order not found", 400));
      }
      order.status = req.body.status;
      await order.save();
      res.status(200).json({
         success: true, 
         message: "Refund accepted successfully",
       });
      // get the product form order cart 
      if(req.body.status === "Refund Success") {
        order.cart.forEach(async(item)=>{
          await updateProduct(item._id, item.qty);
        })
      }
      // update the quantity and sold in product
      async function updateProduct(id, qty) {
        const product = await Product.findById(id);
        if (!product) {
          return next(new ErrorHandler("Product not found", 404));
        }
        product.stock += qty;
        product.sold_out -= qty;
        await product.save();
      }
     
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


// all orders                --- admin

router.get(
  "/admin-all-orders",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find().sort({ deliveredAt:-1, createdAt: -1 });
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
module.exports = router;
