import React from "react";
import styles from "./BillSummary.module.css";

const BillSummary = ({ total, appliedCoupon, tip }) => {
  // Coupon discount calculation
  const discount =
    appliedCoupon?.discountType === "percentage"
      ? (total * appliedCoupon.discountValue) / 100
      : appliedCoupon?.discountType === "flat"
      ? appliedCoupon.discountValue
      : 0;

  const discountedTotal = total - discount;

  // Handling and delivery logic
  const handlingCharge = total > 100 ? 0 : 10;
  const deliveryCharge = total > 150 ? 0 : 40;

  // Final bill calculation including **tip passed from parent**
  const finalAmount =
    discountedTotal + handlingCharge + deliveryCharge + Number(tip || 0);

  return (
    <div className={styles.billSummary}>
      <h3 className={styles.title}>Bill Summary</h3>

      {/* --- Bill Details --- */}
      <div className={styles.row}>
        <span>Item Total</span>
        <span>₹{total.toFixed(2)}</span>
      </div>

      <div className={styles.row}>
        <span>Handling Charges</span>
        {handlingCharge === 0 ? (
          <span className={styles.free}>Free</span>
        ) : (
          <span>₹{handlingCharge}</span>
        )}
      </div>

      <div className={styles.row}>
        <span>Delivery Charges</span>
        {deliveryCharge === 0 ? (
          <span className={styles.free}>Free</span>
        ) : (
          <span>₹{deliveryCharge}</span>
        )}
      </div>

      {appliedCoupon && (
        <div className={`${styles.row} ${styles.discount}`}>
          <span>Coupon ({appliedCoupon.code})</span>
          <span>- ₹{discount.toFixed(2)}</span>
        </div>
      )}

      {tip > 0 && (
        <div className={styles.row}>
          <span>Tip</span>
          <span>₹{tip}</span>
        </div>
      )}

      <hr className={styles.line} />

      {/* --- Total --- */}
      <div className={styles.totalRow}>
        <span>Total to Pay</span>
        <span className={styles.finalPrice}>₹{finalAmount.toFixed(2)}</span>
      </div>

      {appliedCoupon && (
        <p className={styles.savingText}>
          You saved ₹{discount.toFixed(2)} using{" "}
          <strong>{appliedCoupon.code}</strong> 🎉
        </p>
      )}
    </div>
  );
};

export default BillSummary;
