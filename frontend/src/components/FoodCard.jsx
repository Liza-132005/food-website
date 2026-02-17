import React, { useState, useEffect } from "react";
import styles from "./FoodCard.module.css";
import { useCart } from "../context/CartContext";

function FoodCard({ food }) {
  const { cart, addToCart, removeFromCart } = useCart();
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);

  // ✅ Sync UI with cart state
  useEffect(() => {
    const item = cart.find((i) => i.foodId === food._id);
    setQuantity(item ? item.quantity : 0);
  }, [cart, food._id]);

  const handleAdd = async () => {
    setLoading(true);
    try {
      await addToCart(food._id, 1);
    } catch (err) {
      console.error("Error adding item:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (quantity <= 0) return;
    setLoading(true);
    try {
      await removeFromCart(food._id, 1);
    } catch (err) {
      console.error("Error removing item:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      {/* Top Tags */}
      {food.bestseller && (
        <span className={`${styles.tag} ${styles.leftTag}`}>Bestseller</span>
      )}
      {food.topItem && (
        <span className={`${styles.tag} ${styles.rightTag}`}>Top Item</span>
      )}

      {/* Food Image */}
      <img src={food.image} alt={food.name} className={styles.foodImage} />

      {/* Overlay */}
      <div className={styles.overlay}>
        <div className={styles.foodName}>
          <span className={styles.vegSymbol}>🌱</span> {food.name}
        </div>
        <p className={styles.description}>
          {food.description || "Delicious and freshly made for you!"}
        </p>
        <hr />
        <div className={styles.bottomRow}>
          <div className={styles.price}>₹{food.price}</div>

          {/* ✅ Dynamic Button */}
          {quantity > 0 ? (
            <div className={styles.qtyControl}>
              <button
                onClick={handleRemove}
                disabled={loading}
                className={styles.qtyBtn}
              >
                –
              </button>
              <span className={styles.qtyValue}>{quantity}</span>
              <button
                onClick={handleAdd}
                disabled={loading}
                className={styles.qtyBtn}
              >
                +
              </button>
            </div>
          ) : (
            <button
              className={styles.addBtn}
              onClick={handleAdd}
              disabled={loading}
            >
              {loading ? "Adding..." : "ADD +"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default FoodCard;
