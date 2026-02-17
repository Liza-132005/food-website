import { createContext, useContext, useState, useEffect, useMemo } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]); // Always an array
  const [cartTotal, setCartTotal] = useState(0); // 💰 total amount of cart

  // 🟢 Load cart when user logs in or refreshes
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCart(data?.items || []);
      } catch (err) {
        console.error("Error fetching cart:", err);
        setCart([]);
      }
    };

    fetchCart();
  }, []);

  // 🧮 Automatically calculate cart total whenever cart changes
  useEffect(() => {
    const total = cart.reduce((acc, item) => {
      // ✅ backend should return price * quantity fields
      const itemTotal = (item?.food?.price || 0) * (item?.quantity || 1);
      return acc + itemTotal;
    }, 0);
    setCartTotal(total);
  }, [cart]);

  // 🟢 Add to Cart
  const addToCart = async (foodId, quantity = 1) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in!");

    try {
      const res = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ foodId, quantity }),
      });

      const data = await res.json();
      if (data?.items) {
        setCart(data.items);
      } else {
        console.warn("Unexpected cart response:", data);
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  // 🟢 Remove ONE quantity or remove item if quantity = 1
  const removeFromCart = async (foodId, quantity = 1) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in!");

    try {
      const res = await fetch("http://localhost:5000/api/cart/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ foodId, quantity }),
      });

      const data = await res.json();
      if (data?.items) {
        setCart(data.items);
      } else {
        console.warn("Unexpected cart response:", data);
      }
    } catch (err) {
      console.error("Error removing item from cart:", err);
    }
  };

  // 🟢 Clear entire Cart
  const clearCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in!");

    try {
      await fetch("http://localhost:5000/api/cart/clear", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart([]);
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  // ✅ Memoized value for better performance
  const value = useMemo(
    () => ({
      cart,
      setCart,
      addToCart,
      removeFromCart,
      clearCart,
      cartTotal, // 💰 total available everywhere
    }),
    [cart, cartTotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
