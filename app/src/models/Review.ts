import mongoose from "mongoose";

export type IReview = {
  productId: string;
  userEmail: string;
  userName: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  createdAt?: Date;
};

const ReviewSchema = new mongoose.Schema<IReview>({
  productId: { type: String, required: true },
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  verifiedPurchase: { type: Boolean, default: false },
  createdAt: { type: Date, default: () => new Date() },
});

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);
