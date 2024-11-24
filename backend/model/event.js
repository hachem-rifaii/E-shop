const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "event Product name is required"],
  },
  description: {
    type: String,
    required: [true, "event Product description is required"],
  },
  category: {
    type: String,
    required: [true, "event Product category is required"],
  },
  start_Date:{
    type: Date,
    required: [true, "event Product start date is required"],
  },
  Finish_Date: {
    type: Date,
    required: [true, "event Product end date is required"],
  },
  status:{
    type: String,
    default:"running"
  },
  tags: {
    type: [String],
 
  },
  originalPrice: {
    type: Number,
    required: [true, "event Product original price is required"],
  },
  discountPrice: {
    type: Number,
    required: [true, "event Product discount price is required"],
  },
  stock: {
    type: Number,
    required: [true, "event Product stock is required"],
  },
  images: [
    {
      type: String,
    },
  ],
  shopId: {
    type: String,
    required: true,
  },
  shop: {
    type: Object,
    required: true,
  },
  sold_out: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Event" , eventSchema);