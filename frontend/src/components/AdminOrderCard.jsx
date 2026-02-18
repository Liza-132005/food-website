import styles from "../styles/Admin.module.css";

const AdminOrderCard = ({ order, updateStatus }) => {
  return (
    <div className={styles.card}>
      <h3>Order ID: {order._id}</h3>
      <p>User: {order.user?.name}</p>
      <p>Status: <strong>{order.status}</strong></p>
      <p>Total: ₹{order.totalPrice}</p>

      <div className={styles.buttons}>
        <button onClick={() => updateStatus(order._id, "Preparing")}>
          Preparing
        </button>

        <button onClick={() => updateStatus(order._id, "Out for Delivery")}>
          Out for Delivery
        </button>

        <button onClick={() => updateStatus(order._id, "Delivered")}>
          Delivered
        </button>
      </div>
    </div>
  );
};

export default AdminOrderCard;
