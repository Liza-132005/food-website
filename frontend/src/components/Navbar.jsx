import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUser, FaShoppingCart } from "react-icons/fa";
import styles from "./Navbar.module.css";
import logo from "../assets/logo.jpg";
import axios from "axios";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
        localStorage.removeItem("token");
        setUser(null);
      }
    };

    fetchUser();
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className={styles.navbar}>

      {/* ---- Logo ---- */}
      <div className={styles.logo}>
        <Link to="/" className={styles.logoText}>
          Meali<span>Fy</span>
        </Link>
        <img src={logo} alt="MealiFy Logo" className={styles.logoImg} />
      </div>

      {/* ---- Nav Links ---- */}
      <ul className={styles.navLinks}>
        <li>
          <Link
            to="/"
            className={location.pathname === "/" ? styles.active : ""}
          >
            Home
          </Link>
        </li>

        <li>
          <Link
            to="/menu"
            className={location.pathname === "/menu" ? styles.active : ""}
          >
            Menu
          </Link>
        </li>

        <li>
          <Link
            to="/contact"
            className={location.pathname === "/contact" ? styles.active : ""}
          >
            Contact
          </Link>
        </li>

        {/* ⭐ ADDED: My Orders link (only when user is logged in) */}
        {user && (
          <li>
            <Link
              to="/orders"
              className={location.pathname === "/orders" ? styles.active : ""}
            >
              My Orders
            </Link>
          </li>
        )}
      </ul>

      {/* ---- Right Side ---- */}
      <div className={styles.rightIcons}>
        {!user ? (
          <Link to="/login" className={styles.loginBtn}>
            Login / Signup
          </Link>
        ) : (
          <>
            {/* Cart Icon */}
            <Link to="/cart" className={styles.icon}>
              <FaShoppingCart />
            </Link>

            {/* User Dropdown */}
            <div className={styles.userWrapper} ref={dropdownRef}>
              <FaUser
                className={styles.icon}
                onClick={() => setMenuOpen((prev) => !prev)}
              />

              {menuOpen && (
                <div className={styles.dropdownMenu}>
                  <p className={styles.userName}>
                    👋 Hi, <strong>{user.name}</strong>
                  </p>
                  <p className={styles.userEmail}>{user.email}</p>
                  <hr />

                  <Link
                    to="/profile"
                    className={styles.dropdownItem}
                    onClick={() => setMenuOpen(false)}
                  >
                    My Profile
                  </Link>

                  <Link
                    to="/orders"
                    className={styles.dropdownItem}
                    onClick={() => setMenuOpen(false)}
                  >
                    My Orders
                  </Link>

                  <Link
                    to="/cart"
                    className={styles.dropdownItem}
                    onClick={() => setMenuOpen(false)}
                  >
                    My Cart
                  </Link>

                  <button className={styles.logoutBtn} onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

    </nav>
  );
};

export default Navbar;
