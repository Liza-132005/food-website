import express from "express";
import Cart from "../models/Cart.js";
import Food from "../models/FoodItem.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// 🧩 Verify Token Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};

// 🛒 Add or increase quantity
router.post("/add", verifyToken, async (req, res) => {
  const { foodId, quantity } = req.body;

  try {
    const food = await Food.findById(foodId);
    if (!food) return res.status(404).json({ error: "Food not found" });

    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      cart = new Cart({ userId: req.userId, items: [], totalPrice: 0 });
    }

    const existingItem = cart.items.find((i) => i.foodId.equals(foodId));

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        foodId,
        name: food.name,
        description: food.description, // ✅ added description
        image: food.image,             // ✅ added image
        price: food.price,
        quantity,
      });
    }

    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    await cart.save();

    res.json({ items: cart.items, totalPrice: cart.totalPrice });
  } catch (err) {
    console.error("Error adding item:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ➖ Remove or decrease quantity
router.post("/remove", verifyToken, async (req, res) => {
  const { foodId, quantity = 1 } = req.body;

  try {
    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.find((i) => i.foodId.equals(foodId));
    if (!item) return res.status(404).json({ error: "Item not found in cart" });

    if (item.quantity > quantity) {
      item.quantity -= quantity;
    } else {
      cart.items = cart.items.filter((i) => !i.foodId.equals(foodId));
    }

    cart.totalPrice = cart.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );
    await cart.save();

    res.json({ items: cart.items, totalPrice: cart.totalPrice });
  } catch (err) {
    console.error("Error removing item:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🧾 Get user cart
router.get("/", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    res.json(cart || { items: [], totalPrice: 0 });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// 🧹 Clear entire cart
router.delete("/clear", verifyToken, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.json({ message: "Cart cleared successfully" });
  } catch (err) {
    console.error("Error clearing cart:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
