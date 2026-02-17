import React, { useState, useEffect } from "react";
import styles from "./CouponModal.module.css";

const CouponModal = ({ isOpen, onClose, total, onApplyCoupon }) => {
  const [coupons, setCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCards, setExpandedCards] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Fetch coupons from backend
  useEffect(() => {
    if (isOpen) {
      fetch("http://localhost:5000/api/coupons")
        .then((res) => res.json())
        .then((data) => setCoupons(data))
        .catch((err) => console.error("Error fetching coupons:", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleCard = (id) => {
    setExpandedCards((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Filter by search term
  const filteredCoupons = coupons.filter((c) =>
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort: valid (can apply) first, invalid later
  const sortedCoupons = filteredCoupons.sort((a, b) => {
    const aValid = a.minOrderValue <= total;
    const bValid = b.minOrderValue <= total;
    return aValid === bValid ? 0 : aValid ? -1 : 1;
  });

  // Apply coupon
  const handleApply = (coupon) => {
    if (coupon.minOrderValue > total) return;
    setAppliedCoupon(coupon);
    onApplyCoupon(coupon);
  };

  // Remove coupon
  const handleRemove = () => {
    setAppliedCoupon(null);
    onApplyCoupon(null);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          &times;
        </button>

        {/* Search Bar */}
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Enter Coupon Code"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <button className={styles.applyBtn}>APPLY</button>
        </div>

        {/* Coupon Cards */}
        <div className={styles.cardsContainer}>
          {sortedCoupons.map((coupon) => {
            const isExpanded = expandedCards.includes(coupon._id);
            const isDisabled = coupon.minOrderValue > total;
            const isApplied = appliedCoupon?._id === coupon._id;

            return (
              <div
                key={coupon._id}
                className={`${styles.card} ${
                  isDisabled ? styles.disabledCard : ""
                }`}
              >
                <div className={styles.topRow}>
                  <img
                    src={coupon.image}
                    alt={coupon.code}
                    className={styles.cardImg}
                  />
                  <div className={styles.codeWrapper}>
                    <span
                      className={`${styles.codeText} ${
                        isDisabled ? styles.disabledCode : ""
                      }`}
                    >
                      {coupon.code}
                    </span>
                    <button
                      className={`${styles.applyBtn} ${
                        isDisabled ? styles.disabledBtn : ""
                      }`}
                      onClick={() =>
                        isApplied ? handleRemove() : handleApply(coupon)
                      }
                      disabled={isDisabled}
                    >
                      {isApplied ? "REMOVE" : "APPLY"}
                    </button>
                  </div>
                </div>

                <p className={styles.statement}>{coupon.statement}</p>
                <hr className={styles.dottedLine} />
                <p className={styles.description}>{coupon.description}</p>

                {isExpanded && (
                  <>
                    <h4 className={styles.termsHeading}>Terms and Conditions</h4>
                    <ul className={styles.termsList}>
                      {coupon.terms?.map((term, idx) => (
                        <li key={idx}>{term}</li>
                      ))}
                    </ul>
                  </>
                )}

                <button
                  className={styles.moreBtn}
                  onClick={() => toggleCard(coupon._id)}
                >
                  {isExpanded ? "VIEW LESS" : "+ More"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CouponModal;
