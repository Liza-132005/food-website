import { createContext, useContext, useState, useEffect } from "react";
import socket from "../socket"; // ✅ import socket

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(null); // null = loading
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // ===============================
  // Fetch Orders
  // ===============================
  const fetchOrders = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/orders/my-orders", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.success) {
        setOrders(data.orders || []);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // Add New Order
  // ===============================
  const addOrder = (order) => {
    if (!order) return;
    setOrders((prev) => [order, ...(prev || [])]);
  };

  // ===============================
  // Update Order (REAL-TIME)
  // ===============================
  const updateOrder = (updatedOrder) => {
    if (!updatedOrder) return;

    setOrders((prev) =>
      (prev || []).map((order) =>
        order._id === updatedOrder._id ? updatedOrder : order
      )
    );

    // 🔔 Show notification
    setNotification(`Order is now ${updatedOrder.status}`);

    // 🔊 Play sound
    try {
      const audio = new Audio("/notification.mp3");
      audio.play();
    } catch (err) {
      console.log("Audio play failed:", err);
    }
  };

  // ===============================
  // Initial Fetch
  // ===============================
  useEffect(() => {
    fetchOrders();
  }, []);

  // ===============================
  // SOCKET.IO REAL-TIME CONNECTION
  // ===============================
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?._id) return;

    // Join user room
    socket.emit("joinRoom", user._id);

    // Listen for updates
    socket.on("orderUpdated", (updatedOrder) => {
      console.log("📦 Order updated:", updatedOrder);
      updateOrder(updatedOrder);
    });

    return () => {
      socket.off("orderUpdated");
    };
  }, []);

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        fetchOrders,
        addOrder,
        updateOrder,
        notification,
        setNotification,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
