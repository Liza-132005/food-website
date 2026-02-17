import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  category: { type: String, required: true },
  image: { type: String },
  bestseller: { type: Boolean, default: false },
  topItem: { type: Boolean, default: false },
});

const Food = mongoose.model("Food", foodSchema);
export default Food;
