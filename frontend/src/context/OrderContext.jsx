import { createContext, useContext, useState, useEffect } from "react";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setOrders([]);
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/orders/my-orders", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) setOrders(data.orders || []);
      else setOrders([]);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]);
    }
  };

  // addOrder: append a new order to context (so UI updates immediately)
  const addOrder = (order) => {
    if (!order) return;
    setOrders((prev) => [order, ...prev]);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <OrderContext.Provider value={{ orders, setOrders, fetchOrders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
