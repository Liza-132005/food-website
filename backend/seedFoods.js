import mongoose from "mongoose";
import dotenv from "dotenv";
import FoodItem from "./models/FoodItem.js";

dotenv.config();

const foods = [
  {
    name: "Margherita Pizza",
    price: 299,
    category: "Pizza",
    image: "https://example.com/margherita.jpg",
    description: "Classic cheese pizza with tomato sauce."
  },
  {
    name: "Veg Burger",
    price: 149,
    category: "Burgers",
    image: "https://example.com/vegburger.jpg",
    description: "Fresh crispy patty with lettuce and mayo."
  },
  {
    name: "Chicken Biryani",
    price: 249,
    category: "Indian",
    image: "https://example.com/chickenbiryani.jpg",
    description: "Aromatic rice cooked with tender chicken pieces."
  },
  {
    name: "Paneer Butter Masala",
    price: 199,
    category: "Indian",
    image: "https://example.com/paneer.jpg",
    description: "Creamy and rich paneer curry cooked in butter."
  },
  {
    name: "French Fries",
    price: 99,
    category: "Snacks",
    image: "https://example.com/fries.jpg",
    description: "Crispy golden fries with ketchup."
  },
  {
    name: "Cold Coffee",
    price: 129,
    category: "Drinks",
    image: "https://example.com/coldcoffee.jpg",
    description: "Chilled coffee topped with cream."
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB");

    await FoodItem.deleteMany(); // clear old data
    console.log("🗑 Old food items deleted");

    await FoodItem.insertMany(foods);
    console.log("🍕 New food items added successfully!");

    mongoose.connection.close();
  })
  .catch(err => console.error("❌ Error seeding data:", err));
