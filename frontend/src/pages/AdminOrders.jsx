import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import AdminOrderCard from "../components/AdminOrderCard";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();

    // 🔥 Connect socket
    const socket = io("http://localhost:5000");

    socket.on("orderUpdated", (updatedOrder) => {
      setOrders((prev) =>
        prev.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });

    return () => socket.disconnect();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // 🔥 UPDATE STATUS FUNCTION
  const updateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `http://localhost:5000/api/orders/${orderId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update locally (instant UI update)
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? res.data : order
        )
      );

    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div>
      <h1>All Orders</h1>

      {orders.map((order) => (
        <AdminOrderCard
          key={order._id}
          order={order}
          updateStatus={updateStatus}
        />
      ))}
    </div>
  );
}
