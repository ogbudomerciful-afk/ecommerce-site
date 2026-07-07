import mongoose from "mongoose";

export type IOrderItem = {
  productId: string;
  quantity: number;
  price: number;
};

export type IOrder = {
  tx_ref: string;
  userEmail: string;
  items: IOrderItem[];
  total: number;
  status: string;
  trackingNumber?: string;
  address?: string;
  paymentStatus?: string;
  createdAt?: Date;
};

const OrderSchema = new mongoose.Schema<IOrder>({
  tx_ref: { type: String, required: true, unique: true },
  userEmail: { type: String, required: true },
  items: {
  type: [
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  required: true,
},
  total: { type: Number, required: true },
  status: { type: String, required: true, default: "Pending" },
  trackingNumber: String,
  address: String,
  paymentStatus: { type: String, default: "Pending" },
  createdAt: { type: Date, default: () => new Date() },
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
