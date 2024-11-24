const express = require("express");
const Messages = require("../model/message");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { upload } = require("../multer");
const router = express.Router();
const path = require("path");

// create new message
router.post(
  "/create-new-message",
  upload.single("images"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const messageData = req.body;
      if (req.file) {
        const filename = req.file.filename;
        const fileUrl = path.join(filename);
        messageData.images = fileUrl;
      }
      messageData.conversationId = req.body.conversationId;
      messageData.sender = req.body.sender;
      messageData.text = req.body.text;
      const message = new Messages({
        conversationId: messageData.conversationId,
        sender: messageData.sender,
        text: messageData.text,
        images: messageData.images ? messageData.images : undefined,
      });
      await message.save();
      res.status(201).json({ success: true, message });
    } catch (error) {
      return next(new ErrorHandler(error, 500));
    }
  })
);

// get all messages of conversation
router.get(
  "/get-all-messages/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const messages = await Messages.find({
        conversationId: req.params.id,
      });
      res.status(200).json({ success: true, messages });
    } catch (error) {
      return next(new ErrorHandler(error, 500));
    }
  })
);


module.exports = router;
