import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
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
      },
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

    // 🔥 Structured Order Status Flow
    status: {
      type: String,
      enum: [
        "Placed",
        "Accepted",
        "Packing",
        "Out for Delivery",
        "Near You",
        "Delivered",
        "Cancelled",
      ],
      default: "Placed",
    },

    // 🔥 Timeline history (like Zepto tracking)
    trackingHistory: [
      {
        status: String,
        time: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Optional future feature
    estimatedDeliveryTime: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
