import { useEffect, useState } from "react";
import AdminOrderCard from "../components/AdminOrderCard";
import AdminSidebar from "../components/AdminSidebar";
import styles from "../styles/Admin.module.css";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    const res = await fetch("http://localhost:5000/api/orders/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (data.success) setOrders(data.orders);
  };

  const updateStatus = async (orderId, status) => {
    const res = await fetch(
      `http://localhost:5000/api/orders/update/${orderId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    const data = await res.json();

    if (data.success) {
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? data.order : o))
      );
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className={styles.adminContainer}>
      <AdminSidebar />

      <div className={styles.main}>
        <h1>Dashboard</h1>

        {orders.map((order) => (
          <AdminOrderCard
            key={order._id}
            order={order}
            updateStatus={updateStatus}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
