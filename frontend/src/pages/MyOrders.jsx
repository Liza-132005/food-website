import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MyOrders.module.css"; // ✅ import CSS

export default function MyOrders() {
  const [orders, setOrders] = useState(null); // null = loading
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    fetch("http://localhost:5000/api/orders/my-orders", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("ORDERS RESPONSE:", data);
        if (data.success) setOrders(data.orders || []);
        else setOrders([]);
      })
      .catch((err) => {
        console.log(err);
        setOrders([]);
      });
  }, []);

  // While loading
  if (orders === null)
    return <p className={styles.loadingText}>Loading your orders...</p>;

  return (
    <div className={styles.ordersPage}>
      <h2>My Orders</h2>

      {orders.length === 0 && (
        <p className={styles.emptyText}>No orders placed yet.</p>
      )}

      {orders.map((order) => (
        <div key={order._id} className={styles.orderCard}>
          <h3>Order ID: {order.orderId || "N/A"}</h3>
          <p>{order.orderTime ? new Date(order.orderTime).toLocaleString() : "No time"}</p>
          <p className={styles.textGreen}>Status: {order.status || "Confirmed"}</p>

          <hr />

          {(order.items || []).map((item, i) => (
            <div key={i} className={styles.orderItem}>
              <img src={item.image} alt={item.name} />
              <div>
                <p>{item.name}</p>
                <p>Qty: {item.quantity || 1}</p>
              </div>
              <p>₹{(item.price || 0) * (item.quantity || 1)}</p>
            </div>
          ))}

          <hr />

          <p className={styles.fontBold}>
            Total Paid: ₹{order.finalTotal || order.total || 0}
          </p>

          {order.instructions && (
            <p>
              <strong>Instructions:</strong> {order.instructions}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
