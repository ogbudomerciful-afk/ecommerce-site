import mongoose from "mongoose";

export type IUser = {
  name: string;
  email: string;
  password: string;
  role: "customer" | "admin";
  address?: string;
  phone?: string;
  emailVerified?: boolean;
  verificationToken?: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  addresses?: Array<{
    id: string;
    label: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    isDefault: boolean;
  }>;
  wishlist?: string[];
};

const UserSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: "customer" },
  address: String,
  phone: String,
  emailVerified: { type: Boolean, default: false },
  verificationToken: String,
  resetToken: String,
  resetTokenExpiry: Date,
  addresses: [{ type: mongoose.Schema.Types.Mixed }],
  wishlist: [{ type: String }],
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
