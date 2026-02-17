// models/Coupon.js
import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  statement: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  discountType: {
    type: String,
    enum: ["flat", "percentage"],
    required: true,
  },
  discountValue: {
    type: Number,
    required: true,
  },
  minOrderValue: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    required: true,
  },
  terms: {
    type: [String],
    default: [],
  },
});

export default mongoose.model("Coupon", couponSchema);
