const express = require("express");
const router = express.Router();
const { upload } = require("../multer");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const Shop = require("../model/shop");
const { isSeller, isAdmin, isAuthenticated } = require("../middleware/auth");
const Event = require("../model/event");
const fs = require("fs");

// routes
router.post(
  "/create-event",
  upload.array("images"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);

      if (!shop) {
        return next(new ErrorHandler("Shop not found", 404));
      } else {
        const files = req.files;
        const imageUrls = files.map((file) => `${file.filename}`);
  
        const eventData = req.body;
        eventData.images = imageUrls;
        eventData.shop = shop;

        // create product
        const event = await Event.create(eventData);
        res.status(201).json({
          success: true,
          event,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);
// get all events
router.get("/get-all-events", async (req, res, next) => {
  try {
    const events = await Event.find();
    res.status(201).json({
      success: true,
      events,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

// get all events products of a shop
router.get(
  "/get-all-event-shop/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find({ shopId: req.params.id });
      res.status(200).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// delete products of a shop
router.delete(
  "/delete-shop-event/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      // get the event to delete
      const eventId = req.params.id;
      const eventData = await Event.findById(eventId);
      if (!eventData) {
        return next(new ErrorHandler("Event not found", 404));
      }
      // delete image
      eventData.images.forEach((imageUrl) => {
        const filename = imageUrl;
        const filePath = `uploads/${filename}`;
        fs.unlink(filePath, function (err) {
          if (err) {
            console.log("Error deleting file:", err);
          }
        });
      });

      // delete event from db
      const event = await Event.findByIdAndDelete(eventId);

      if (!event) {
        return next(new ErrorHandler("Event not found", 404));
      }

      // send response
      res.status(201).json({
        success: true,
        messsage: "Event deleted successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// all product                --- admin
router.get(
  "/admin-all-events",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find().sort({ createdAt: -1 });
      res.status(200).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
module.exports = router;
