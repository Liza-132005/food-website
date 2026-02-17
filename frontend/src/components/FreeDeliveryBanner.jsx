import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import styles from "./FreeDeliveryBanner.module.css";

const FreeDeliveryBanner = ({ cartTotal = 0 }) => {
  const FREE_DELIVERY_THRESHOLD = 150;
  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - cartTotal);

  const navigate = useNavigate();
  const location = useLocation();
  const bannerRef = useRef(null);

  const visiblePaths = ["/", "/menu", "/cart"];
  const isVisible = visiblePaths.includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector("footer");
      if (footer && bannerRef.current) {
        const footerRect = footer.getBoundingClientRect();
        const offset = Math.max(0, window.innerHeight - footerRect.top);
        bannerRef.current.style.bottom = `${offset}px`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll(); // initial

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div ref={bannerRef} className={styles.bannerWrapper}>
      <div className={styles.banner}>
        {remaining > 0 ? (
          <>
            <span className={styles.text}>
              🛒 Shop for ₹{remaining} more to unlock FREE Delivery!
            </span>
            <button
              className={styles.button}
              onClick={() => navigate("/menu")}
            >
              Order Now
            </button>
          </>
        ) : (
          <span className={styles.text}>
            🎉 You’ve unlocked FREE Delivery on your order!
          </span>
        )}
      </div>
    </div>
  );
};

export default FreeDeliveryBanner;
