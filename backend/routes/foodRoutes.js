import express from "express";
import Food from "../models/FoodItem.js";

const router = express.Router();

// ➕ Add new food item (Admin)
router.post("/", async (req, res) => {
  try {
    const food = new Food(req.body);
    await food.save();
    res.status(201).json(food);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📜 Get all food items
router.get("/", async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ Update food item
router.put("/:id", async (req, res) => {
  try {
    const updatedFood = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedFood);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ❌ Delete food item
router.delete("/:id", async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ message: "Food item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
