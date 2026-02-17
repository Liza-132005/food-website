import express from "express";
import Order from "../models/Order.js";
import authMiddleware from "../middleware/auth.js";
import mongoose from "mongoose";

const router = express.Router();

// Generate random order ID
function generateOrderId() {
  return "ORD-" + Math.floor(100000 + Math.random() * 900000);
}

// POST — Create Order
router.post("/create", authMiddleware, async (req, res) => {
  try {
    console.log("REQ.USER:", req.user);

    if (!req.user?.id) {
      return res.status(401).json({ error: "Invalid user token" });
    }

    const orderId = generateOrderId();

    const order = new Order({
      userId: new mongoose.Types.ObjectId(req.user.id),
      orderId,
      items: req.body.items,
      instructions: req.body.instructions,
      total: req.body.total,
      discount: req.body.discount,
      finalTotal: req.body.finalTotal,
      tip: req.body.tip,
      orderTime: req.body.orderTime,
    });

    await order.save();

    return res.json({
      success: true,
      message: "Order stored successfully!",
      order,
    });

  } catch (err) {
    console.error("ORDER CREATE ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});

// GET — Fetch all orders of logged-in user
router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    console.log("FETCHING ORDERS FOR:", req.user);

    const userId = new mongoose.Types.ObjectId(req.user.id); // 🔥 IMPORTANT

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    return res.json({ success: true, orders });

  } catch (err) {
    console.error("FETCH ORDERS ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
