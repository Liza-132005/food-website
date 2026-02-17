import React from "react";
import styles from "./Marquee.module.css";

const Marquee = () => {
  return (
    <div className={styles.marqueeContainer}>
      <div className={styles.marqueeContent}>
        🍕 Today’s Special: Margherita Pizza 20% Off! 🥗 Free delivery above ₹500! 🍔 Try our new Burger Combo! 🍰 Desserts at 15% Off! 🍜 Explore Chef's Specials!
      </div>
    </div>
  );
};

export default Marquee;
