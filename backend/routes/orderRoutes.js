import express from "express";
import Order from "../models/Order.js";
import authMiddleware from "../middleware/auth.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import mongoose from "mongoose";

const router = express.Router();

function generateOrderId() {
  return "ORD-" + Math.floor(100000 + Math.random() * 900000);
}

//
// =========================================
// 🔥 CREATE ORDER (USER)
// =========================================
//
router.post("/create", authMiddleware, async (req, res) => {
  try {
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
      status: "Placed",
      trackingHistory: [
        {
          status: "Placed",
          time: new Date(),
        },
      ],
      estimatedDeliveryTime: new Date(Date.now() + 30 * 60000),
    });

    await order.save();

    const io = req.app.get("io");

    // Emit to that specific user
    io.to(req.user.id).emit("orderUpdated", order);

    return res.json({
      success: true,
      message: "Order placed successfully!",
      order,
    });

  } catch (err) {
    console.error("ORDER CREATE ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});


//
// =========================================
// 🔥 GET USER ORDERS
// =========================================
//
router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    return res.json({ success: true, orders });

  } catch (err) {
    console.error("FETCH ORDERS ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});


//
// =========================================
// 🔥 GET ALL ORDERS (ADMIN ONLY)
// =========================================
//
router.get("/all", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return res.json({ success: true, orders });

  } catch (err) {
    console.error("ADMIN FETCH ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});


//
// =========================================
// 🔥 UPDATE ORDER STATUS (ADMIN ONLY)
// =========================================
//
router.put(
  "/update/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { status } = req.body;

      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      order.status = status;

      order.trackingHistory.push({
        status,
        time: new Date(),
      });

      await order.save();

      const io = req.app.get("io");

      // Emit real-time update to user
      io.to(order.userId.toString()).emit("orderUpdated", order);

      return res.json({
        success: true,
        message: "Order status updated",
        order,
      });

    } catch (err) {
      console.error("ADMIN UPDATE ERROR:", err);
      return res.status(500).json({ error: err.message });
    }
  }
);

export default router;
