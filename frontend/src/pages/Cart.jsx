import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext"; // ✅ Correct import
import CartItem from "../components/CartItem";
import FreeDeliveryBanner from "../components/FreeDeliveryBanner";
import CouponModal from "../components/CouponModal";
import styles from "./Cart.module.css";
import BillSummary from "../components/BillSummary";
import SavingsSummary from "../components/SavingsSummary";
import TipAndInstructions from "../components/TipAndInstructions";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, clearCart } = useCart();
  const { addOrder } = useOrders(); // ✅ UseOrders from context
  const [isCouponOpen, setIsCouponOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [bestCoupon, setBestCoupon] = useState(null);
  const [tip, setTip] = useState(0);
  const [instructions, setInstructions] = useState("");
  const navigate = useNavigate();

  const total = cart.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );

  // Fetch coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/coupons");
        setCoupons(res.data || []);
      } catch (err) {
        console.error("Error fetching coupons:", err);
      }
    };
    fetchCoupons();
  }, []);

  // Find best coupon automatically
  useEffect(() => {
    if (!total || !coupons.length) return;

    let best = null;
    let maxDiscount = 0;

    coupons.forEach((coupon) => {
      if (total >= coupon.minOrderValue) {
        let discount = 0;
        if (coupon.discountType === "flat") discount = coupon.discountValue;
        else if (coupon.discountType === "percentage") discount = (total * coupon.discountValue) / 100;

        if (discount > maxDiscount) {
          maxDiscount = discount;
          best = coupon;
        }
      }
    });

    setBestCoupon(best);
  }, [coupons, total]);

  const discount =
    appliedCoupon?.discountType === "percentage"
      ? (total * appliedCoupon.discountValue) / 100
      : appliedCoupon?.discountType === "flat"
      ? appliedCoupon.discountValue
      : 0;

  const finalTotal = total - discount + tip;

  // Place order
  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in to place an order");

    const payload = {
      items: cart.map((item) => ({
        foodId: item.foodId || item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity || 1,
      })),
      total,
      discount,
      tip,
      instructions,
      finalTotal,
      appliedCoupon,
      orderTime: new Date().toISOString(),
    };

    try {
      const res = await fetch("http://localhost:5000/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.success) {
        console.log("Order failed:", data);
        return alert("Failed to place order. Try again.");
      }

      addOrder(data.order); // ✅ Update OrderContext instantly
      clearCart(); // ✅ Clear cart
      navigate("/order-success", { state: data.order }); // ✅ Go to success page
    } catch (err) {
      console.error("Order error:", err);
      alert("Server error while placing order.");
    }
  };

  if (!cart || !cart.length) {
    return <h2 className={styles.emptyText}>Your cart is empty 🛒</h2>;
  }

  return (
    <div className={styles.cartPage}>
      <h2 className={styles.cartHeading}>Your Cart</h2>

      <div className={styles.cartItems}>
        {cart.map((item) => (
          <CartItem key={item.foodId || item._id} item={item} />
        ))}
      </div>

      <div className={styles.missingBanner}>
        <span>Missing something?</span>
        <button onClick={() => navigate("/menu")} className={styles.addMoreBtn}>
          + Add More Items
        </button>
      </div>

      {/* Best Coupon Banner */}
      {bestCoupon && !appliedCoupon && (
        <div className={styles.bestCouponBanner}>
          <div className={styles.bestCouponText}>
            💡 <strong>Best Coupon:</strong> {bestCoupon.code} —{" "}
            {bestCoupon.discountType === "flat"
              ? `Save ₹${bestCoupon.discountValue}`
              : `Save ${bestCoupon.discountValue}%`}
          </div>
          <div className={styles.applyCouponRight}>
            <button className={styles.couponBtn} onClick={() => setIsCouponOpen(true)}>
              Apply Coupon
            </button>
          </div>
        </div>
      )}

      {/* Applied Coupon */}
      {appliedCoupon && (
        <div className={styles.couponBtnWrapper}>
          <button className={styles.couponBtn} onClick={() => setIsCouponOpen(true)}>
            Applied: {appliedCoupon.code}
          </button>
        </div>
      )}

      <TipAndInstructions onTipChange={setTip} onInstructionChange={setInstructions} />
      <BillSummary total={total} appliedCoupon={appliedCoupon} tip={tip} />
      <FreeDeliveryBanner cartTotal={finalTotal} />
      <SavingsSummary total={total} appliedCoupon={appliedCoupon} />

      <CouponModal
        isOpen={isCouponOpen}
        onClose={() => setIsCouponOpen(false)}
        total={total}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={(coupon) => {
          setAppliedCoupon(coupon);
          setIsCouponOpen(false);
        }}
      />

      {/* PLACE ORDER */}
      <div className={styles.placeOrderSection}>
        <span className={styles.orderTotalText}>Total: ₹{finalTotal.toFixed(2)}</span>
        <button className={styles.placeOrderBtn} onClick={handlePlaceOrder}>
          Place Order
        </button>
      </div>
    </div>
  );
}
