import React from "react";
import { useCart } from "../context/CartContext";
import styles from "./CartItem.module.css";

const CartItem = ({ item }) => {
  const { addToCart, removeFromCart } = useCart();

  // ✅ Use the correct foodId from the cart item
  const handleIncrement = () => addToCart(item.foodId, 1);
  const handleDecrement = () => removeFromCart(item.foodId, 1);

  return (
    <div className={styles.cartItem}>
      {/* Item Image */}
      <div className={styles.imageWrapper}>
        <img src={item.image} alt={item.name} className={styles.image} />
      </div>

      {/* Middle: Name and Description */}
      <div className={styles.info}>
        <h3 className={styles.name}>{item.name}</h3>
        <p className={styles.description}>{item.description}</p>
      </div>

      {/* Right: Quantity and Price */}
      <div className={styles.actions}>
        <div className={styles.quantity}>
          <button
            onClick={handleDecrement}
            className={styles.qtyBtn}
            disabled={item.quantity <= 0} // optional: prevent negative quantities
          >
            -
          </button>
          <span>{item.quantity}</span>
          <button onClick={handleIncrement} className={styles.qtyBtn}>
            +
          </button>
        </div>
        {/* Total price for this item */}
        <div className={styles.price}>₹{item.price * item.quantity}</div>
      </div>
    </div>
  );
};

export default CartItem;
