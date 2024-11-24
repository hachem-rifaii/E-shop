const express = require("express");
const Withdraw = require("../model/withdraw");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const sendMail = require("../utils/sendMail");

const Shop = require("../model/shop");
const router = express.Router();

// create withdraw request   --- seller
router.post(
  "/create-withdraw-request",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { amount } = req.body;
      if (!amount) {
        return next(new ErrorHandler("Please provide an amount", 400));
      }
      const data = {
        seller: req.seller,
        amount,
      };

      try {
        await sendMail({
          email: req.seller.email,
          subject: "Withdraw Request",
          message: `Hello ${req.seller.name} , Your withdraw request of ${amount}$ is processing, It will take 3 days to 7 days for processing to completed`,
        });
        res.status(201).json({
          success: true,
        });
      } catch (error) {
        return next(new ErrorHandler(error, 500));
      }

      const withdraw = await Withdraw.create(data);
      const shop = await Shop.findById(req.seller._id);
      shop.availableBalance = shop.availableBalance - amount;
      await shop.save();

      res.status(201).json({
        success: true,
        withdraw,
      });
    } catch (err) {
      next(new ErrorHandler("Failed to create withdraw request", 500));
    }
  })
);

// get all withdraw --- admin

router.get(
  "/get-all-withdraw-request",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const withdraws = await Withdraw.find().sort({ createdAt: -1 });
      res.status(200).json({ success: true, withdraws });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update withdraw status --- admin

router.put(
  "/update-withdraw-request/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { sellerID } = req.body;
      const withdraws = await Withdraw.findByIdAndUpdate(
        req.params.id,
        { status: "Succeed", updatedAt: Date.now() },
        { new: true }
      );
      const seller = await Shop.findById(sellerID);
      console.log(seller)
      const transection = {
        _id: withdraw._id,
        amount: withdraw.amount,
        updatedAt: withdraw.updatedAt,
        status: withdraw.status,
      };
      seller.transactions = [...seller.transactions, transection];
      await seller.save();

      // send mail notification
      try {
        await sendMail({
          email: seller.email,
          subject: "Payment Confirmation",
          message: `Hello ${seller.name}, Your withdraw request of ${withdraw.amount}$ is on the way . delivery time depends on your bank's rules it usually takes 3days to 7days`,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }

      res.status(201).json({ success: true ,
        withdraws,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
module.exports = router;
