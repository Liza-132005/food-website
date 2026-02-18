import CountdownTimer from "./CountdownTimer";
import RiderMap from "./RiderMap";
import styles from "../pages/MyOrders.module.css";

const STATUS_STEPS = [
  "Placed",
  "Confirmed",
  "Packed",
  "Out for Delivery",
  "Delivered",
];

export default function OrderTrackingCard({ order }) {
  const currentStep = STATUS_STEPS.indexOf(order.status || "Confirmed");

  return (
    <div className={styles.orderCard}>
      <div className={styles.orderHeader}>
        <div>
          <h3>Order ID: {order.orderId}</h3>
          <p>{new Date(order.orderTime).toLocaleString()}</p>
        </div>

        <span className={`${styles.statusBadge} ${styles[`status${currentStep}`]}`}>
          {order.status}
        </span>
      </div>

      {/* Timeline */}
      <div className={styles.timeline}>
        {STATUS_STEPS.map((step, index) => (
          <div key={step} className={styles.timelineItem}>
            <div
              className={`${styles.circle} ${
                index <= currentStep ? styles.activeCircle : ""
              }`}
            />
            <span
              className={
                index <= currentStep
                  ? styles.activeText
                  : styles.inactiveText
              }
            >
              {step}
            </span>
          </div>
        ))}
      </div>

      {/* Countdown */}
      {order.status !== "Delivered" && order.estimatedDelivery && (
        <CountdownTimer estimatedTime={order.estimatedDelivery} />
      )}

      {/* Rider Map */}
      {order.status === "Out for Delivery" && <RiderMap />}

      <hr />

      {(order.items || []).map((item, i) => (
        <div key={i} className={styles.orderItem}>
          <img src={item.image} alt={item.name} />
          <div>
            <p>{item.name}</p>
            <p>Qty: {item.quantity || 1}</p>
          </div>
          <p>₹{item.price * item.quantity}</p>
        </div>
      ))}

      <hr />

      <p className={styles.totalAmount}>
        Total Paid: ₹{order.finalTotal || order.total}
      </p>
    </div>
  );
}
