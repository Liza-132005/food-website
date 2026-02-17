import React, { useEffect, useState } from "react";
import axios from "axios";
import FoodCard from "../components/FoodCard";
import styles from "./Menu.module.css";
import { useCart } from "../context/CartContext";
import Carousel from "../components/FoodCardCarousel";  // ⭐ IMPORT CAROUSEL

const Menu = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/foods");
        setFoods(res.data);
      } catch (err) {
        console.error("❌ Error fetching foods:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  // Get unique categories
  const categories = ["All", ...new Set(foods.map((item) => item.category))];

  // Filtering (same logic)
  const filteredFoods =
    activeCategory === "All"
      ? foods
      : foods.filter((item) => item.category === activeCategory);

  // Group by category
  const groupedFoods = filteredFoods.reduce((acc, item) => {
    const cat = item.category || "Others";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className={styles.menuPage}>
    <div className={styles.heroSection}>
  <div>
    <h1 className={styles.title}>Our Menu</h1>
    <p className={styles.subHeading}>Freshly made • Carefully curated • Served with quality</p>
  </div>
  </div>


      {/* ⭐ CATEGORY FILTER BAR ⭐ */}
      <div className={styles.filterBar}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`${styles.filterBtn} ${
              activeCategory === cat ? styles.activeFilter : ""
            }`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
            
      {/* ⭐ LOADING / EMPTY HANDLING ⭐ */}
      {loading ? (
        <p className={styles.loading}>Loading menu...</p>
      ) : Object.keys(groupedFoods).length === 0 ? (
        <p className={styles.noItems}>No items found in this category.</p>
      ) : (
        Object.keys(groupedFoods).map((category) => (
          <section key={category} className={styles.section}>

            {/* CATEGORY TITLE */}
            <h2 className={styles.sectionTitle}>{category}</h2>

            {/* ⭐ REPLACE GRID WITH CAROUSEL ⭐ */}
            <Carousel
              items={groupedFoods[category].map((food) => ({
                _id: food._id,
                name: food.name,
                price: food.price,
                image: food.image,
                description: food.description,
                veg: food.veg,
                onAdd: () => addToCart(food._id, 1),
                food, // pass whole food if needed
              }))}
            />
          </section>
        ))
      )}
    </div>
  );
};

export default Menu;
