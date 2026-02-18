import React from "react";
import { useNavigate } from "react-router-dom";
import { useOrders } from "../context/OrderContext";
import OrderTrackingCard from "../components/OrderTrackingCard";
import NotificationPopup from "../components/NotificationPopup";
import styles from "./MyOrders.module.css";

export default function MyOrders() {
  const { orders, loading, notification, setNotification } = useOrders();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  if (!token) navigate("/login");

  if (loading)
    return <p className={styles.loadingText}>Loading your orders...</p>;

  return (
    <div className={styles.ordersPage}>
      <h2>My Orders</h2>

      {/* 🔔 Notification Popup */}
      {notification && (
        <NotificationPopup
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}

      {orders.length === 0 && (
        <p className={styles.emptyText}>No orders placed yet.</p>
      )}

      {orders.map((order) => (
        <OrderTrackingCard key={order._id} order={order} />
      ))}
    </div>
  );
}
