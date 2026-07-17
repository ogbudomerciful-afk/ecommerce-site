import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const RegisterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  address: z.string().optional(),
});

export const CreateOrderSchema = z.object({
  tx_ref: z.string().min(1, "Transaction reference is required"),
  userEmail: z.string().email("Invalid email"),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().positive(),
    price: z.number().nonnegative(),
  })).min(1, "At least one item is required"),
  total: z.number().positive("Total must be positive"),
  address: z.string().optional(),
});

export const UpdateOrderSchema = z.object({
  orderId: z.string().optional(),
  tx_ref: z.string().optional(),
  status: z.enum(["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]).optional(),
  paymentStatus: z.string().optional(),
}).refine((data) => data.orderId || data.tx_ref, {
  message: "Either orderId or tx_ref is required",
});

export const PaymentLinkSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().default("NGN"),
  email: z.string().email("Invalid email"),
  tx_ref: z.string().min(1, "Transaction reference is required"),
});

export const EmailSchema = z.object({
  to: z.string().email("Invalid recipient email"),
  subject: z.string().min(1, "Subject is required"),
  html: z.string().min(1, "Email body is required"),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type UpdateOrderInput = z.infer<typeof UpdateOrderSchema>;
export type PaymentLinkInput = z.infer<typeof PaymentLinkSchema>;
export type EmailInput = z.infer<typeof EmailSchema>;
