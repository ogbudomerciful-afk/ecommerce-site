import mongoose from "mongoose";

export type IProduct = {
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  inventory: number;
  badge?: string;
};

const ProductSchema = new mongoose.Schema<IProduct>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  inventory: { type: Number, required: true, default: 0 },
  badge: String,
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
