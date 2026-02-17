import React from "react";
import styles from "./Footer.module.css";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerSection}>
        <h3 className={styles.footerTitle}>MealiFy</h3>
        <p>
          Delivering happiness through delicious food. Fresh, fast, and crafted
          with love ❤️
        </p>
        <div className={styles.footerSocials}>
          <a href="#" className={styles.socialIcon}><Facebook /></a>
          <a href="#" className={styles.socialIcon}><Instagram /></a>
          <a href="#" className={styles.socialIcon}><Twitter /></a>
          <a href="#" className={styles.socialIcon}><Linkedin /></a>
        </div>
      </div>

      <div className={styles.footerSection}>
        <h4 className={styles.footerTitle}>Quick Links</h4>
        <ul className={styles.footerLinks}>
          <li><a href="/">Home</a></li>
          <li><a href="/menu">Menu</a></li>
          <li><a href="/about">About Us</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>

      <div className={styles.footerSection}>
        <h4 className={styles.footerTitle}>Contact</h4>
        <ul className={styles.footerLinks}>
          <li>📞 +91-7888757414</li>
          <li>📧 support@mealify.com</li>
          <li>🏠 Rajpura, Punjab</li>
        </ul>
      </div>

      <div className={styles.footerBottom}>
        © {new Date().getFullYear()} MealiFy | All Rights Reserved 🍽️
      </div>
    </footer>
  );
};

export default Footer;
