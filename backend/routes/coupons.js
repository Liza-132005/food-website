// routes/coupons.js
import express from "express";
import Coupon from "../models/Coupon.js";

const router = express.Router();

/**
 * @route   GET /api/coupons
 * @desc    Get all coupons
 */
router.get("/", async (req, res) => {
  try {
    const coupons = await Coupon.find({});
    res.status(200).json(coupons);
  } catch (err) {
    console.error("Error fetching coupons:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * @route   GET /api/coupons/:id
 * @desc    Get a single coupon by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon)
      return res.status(404).json({ error: "Coupon not found" });
    res.status(200).json(coupon);
  } catch (err) {
    console.error("Error fetching coupon:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * @route   POST /api/coupons
 * @desc    Create a new coupon
 */
router.post("/", async (req, res) => {
  try {
    const newCoupon = new Coupon(req.body);
    const savedCoupon = await newCoupon.save();
    res.status(201).json(savedCoupon);
  } catch (err) {
    console.error("Error adding coupon:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   PUT /api/coupons/:id
 * @desc    Update a coupon by ID
 */
router.put("/:id", async (req, res) => {
  try {
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCoupon)
      return res.status(404).json({ error: "Coupon not found" });

    res.status(200).json(updatedCoupon);
  } catch (err) {
    console.error("Error updating coupon:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * @route   DELETE /api/coupons/:id
 * @desc    Delete a coupon by ID
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Coupon.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ error: "Coupon not found" });

    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (err) {
    console.error("Error deleting coupon:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
