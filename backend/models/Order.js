import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  items: [
    {
      name: String,
      image: String,
      price: Number,
      quantity: Number,
    }
  ],
  instructions: {
    type: String,
    default: "",
  },
  total: Number,
  discount: Number,
  finalTotal: Number,
  tip: Number,
  orderTime: String,
  status: {
    type: String,
    default: "Placed",
  }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
