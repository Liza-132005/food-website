// Home.jsx
import React, { useEffect, useState } from "react";
import styles from "./Home.module.css";
import video from "../assets/home-video.mp4";
import Marquee from "../components/Marquee";
import Carousel from "../components/FoodCardCarousel";
import axios from "axios";

const isTruthyFlag = (v) => {
  return (
    v === true ||
    v === "true" ||
    v === "True" ||
    v === 1 ||
    v === "1" ||
    v === "yes" ||
    v === "Yes" ||
    v === "Y" ||
    v === "y"
  );
};

const Home = () => {
  const [frequentlyOrdered, setFrequentlyOrdered] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopItems = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/foods");
        // Debug: uncomment during development:
        // console.log("ALL FOODS (home):", res.data);

        const filtered = res.data.filter((item) => {
          return isTruthyFlag(item.bestseller) || isTruthyFlag(item.topItem);
        });

        setFrequentlyOrdered(filtered.slice(0, 15));
      } catch (err) {
        console.error("Error fetching home items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopItems();
  }, []);

  return (
    <>
      <section className={styles.heroSection}>
        <video autoPlay loop muted playsInline className={styles.backgroundVideo}>
          <source src={video} type="video/mp4" />
        </video>

        <div className={styles.overlay}>
          <h1>
            Welcome to Meali<span>Fy</span>
          </h1>
          <p>Delicious food delivered fresh to your doorstep</p>
          <button className={styles.ctaBtn}>Order Now</button>
        </div>
      </section>

      <section>
        <Marquee />
      </section>

      <section className={styles.frequentlySection}>
        <div className={styles.frequentlyHeader}>
          <span className={styles.trendingBadge}>🔥 Customer Favourites</span>
          <h2 className={styles.mainHeading}>Most Frequently Ordered</h2>
          <p className={styles.subHeading}>
            Dishes customers love the most — handpicked for you.
          </p>
        </div>

        <div className={styles.frequentlyContent}>
          {loading ? (
            <p style={{ textAlign: "center" }}>Loading...</p>
          ) : (
            <Carousel items={frequentlyOrdered} />
          )}
        </div>
      </section>
    </>
  );
};

export default Home;
