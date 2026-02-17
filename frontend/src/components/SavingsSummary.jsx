import React from "react";
import styles from "./SavingsSummary.module.css";

const SavingsSummary = ({ total, appliedCoupon }) => {
  // --- Savings logic ---
  const savedFromHandling = total > 100 ? 10 : 0;
  const savedFromDelivery = total > 150 ? 40 : 0;

  const couponDiscount =
    appliedCoupon?.discountType === "percentage"
      ? (total * appliedCoupon.discountValue) / 100
      : appliedCoupon?.discountType === "flat"
      ? appliedCoupon.discountValue
      : 0;

  const totalSavings =
    savedFromHandling + savedFromDelivery + (couponDiscount || 0);

  // If no savings, don’t show component
  if (totalSavings <= 0) return null;

  return (
    <div className={styles.savingsBox}>
      <div className={styles.banner}>
        🎉 You saved ₹{totalSavings.toFixed(2)} on this order!
      </div>

      <div className={styles.breakdown}>
        {couponDiscount > 0 && (
          <div className={styles.row}>
            <span>Coupon Discount ({appliedCoupon.code})</span>
            <span>- ₹{couponDiscount.toFixed(2)}</span>
          </div>
        )}

        {savedFromDelivery > 0 && (
          <div className={styles.row}>
            <span>Free Delivery</span>
            <span>- ₹{savedFromDelivery}</span>
          </div>
        )}

        {savedFromHandling > 0 && (
          <div className={styles.row}>
            <span>Free Handling Charges</span>
            <span>- ₹{savedFromHandling}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavingsSummary;
