// FoodCardCarousel.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import FoodCard from "./FoodCard";
import styles from "./FoodCardCarousel.module.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FoodCardCarousel = ({ items }) => {
  const [foods, setFoods] = useState(items || []);
  const [loading, setLoading] = useState(!items);
  const carouselRef = useRef(null);

  useEffect(() => {
    if (items && items.length > 0) {
      setFoods(items);
      setLoading(false);
      return;
    }

    const fetchFoods = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/foods");
        setFoods(res.data);
      } catch (error) {
        console.error("Error fetching foods:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [items]);

  const scrollLeft = () => carouselRef.current?.scrollBy({ left: -350, behavior: "smooth" });
  const scrollRight = () => carouselRef.current?.scrollBy({ left: 350, behavior: "smooth" });

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div className={styles.carouselWrapper}>
      <button className={styles.navButton} onClick={scrollLeft}><ChevronLeft size={28} /></button>

      <div className={styles.carousel} ref={carouselRef}>
        {foods.map((food) => (
          // pass the whole food; FoodCard will handle flags
          <FoodCard key={food._id} food={food} />
        ))}
      </div>

      <button className={styles.navButton} onClick={scrollRight}><ChevronRight size={28} /></button>
    </div>
  );
};

export default FoodCardCarousel;
