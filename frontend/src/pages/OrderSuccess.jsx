import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./OrderSuccess.module.css";

export default function OrderSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return <h2 className={styles.empty}>No order details available.</h2>;
  }

  const {
    orderId,
    items,
    total,
    discount,
    finalTotal,
    tip,
    orderTime,
    instructions
  } = state;

  return (
    <div className={styles.page}>

      {/* Success Block */}
      <div className={styles.successBox}>
        <div className={styles.tick}>✓</div>
        <h2>Order Placed Successfully!</h2>
        <p className={styles.orderId}>Order ID: {orderId}</p>
        <p className={styles.time}>{orderTime}</p>
      </div>

      {/* Items Title */}
      <h3 className={styles.sectionTitle}>Your Ordered Items</h3>

      {/* Ordered Items */}
      <div className={styles.itemsList}>
        {items.map((item) => (
          <div key={item.foodId || item._id} className={styles.itemCard}>
            <img src={item.image} alt="" className={styles.itemImg} />

            <div className={styles.info}>
              <h4>{item.name}</h4>
              <p>Qty: {item.quantity}</p>
            </div>

            <div className={styles.price}>₹{item.price * item.quantity}</div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className={styles.summary}>
        <h3 className={styles.summaryTitle}>Order Summary</h3>

        <div className={styles.summaryRow}>
          <span>Items Total</span>
          <span>₹{total}</span>
        </div>

        <div className={styles.summaryRow}>
          <span>Discount</span>
          <span className={styles.discount}>- ₹{discount}</span>
        </div>

        {tip > 0 && (
          <div className={styles.summaryRow}>
            <span>Tip</span>
            <span>₹{tip}</span>
          </div>
        )}

        {/* ⭐ Delivery Instructions Block */}
        {instructions && instructions.trim() !== "" && (
          <>
            <div className={styles.summaryRow}>
              <span>Delivery Instructions</span>
            </div>

            <div className={styles.instructionBox}>
              {instructions}
            </div>
          </>
        )}

        <hr />

        <div className={styles.totalRow}>
          <span>Total Payable</span>
          <span className={styles.total}>₹{finalTotal}</span>
        </div>
      </div>

      {/* Button */}
      <button className={styles.btn} onClick={() => navigate("/menu")}>
        Continue Shopping
      </button>

    </div>
  );
}
