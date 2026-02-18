import { useEffect } from "react";
import styles from "./NotificationPopup.module.css";

export default function NotificationPopup({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={styles.popup}>
      🔔 {message}
    </div>
  );
}
