export type UserRole = "customer" | "admin";

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  inventory: number;
  badge?: string;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type Order = {
  id: string;
  userEmail: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  trackingNumber: string;
  createdAt: string;
  address: string;
  paymentStatus: "Pending" | "Paid";
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  address?: string;
  phone?: string;
};

export const starterProducts: Product[] = [
  {
    id: "p1",
    name: "Aurora Headphones",
    price: 98000,
    category: "Audio",
    description: "Immersive sound with active noise cancellation.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    inventory: 12,
    badge: "Bestseller",
  },
  {
    id: "p2",
    name: "Nova Smartwatch",
    price: 145000,
    category: "Wearables",
    description: "Track workouts, sleep, and notifications in style.",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80",
    inventory: 5,
    badge: "Low stock",
  },
  {
    id: "p3",
    name: "Lumen Backpack",
    price: 68000,
    category: "Lifestyle",
    description: "Weatherproof bag with modular compartments.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    inventory: 20,
  },
  {
    id: "p4",
    name: "Pulse Keyboard",
    price: 112000,
    category: "Accessories",
    description: "Compact keyboard designed for fast typing.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
    inventory: 8,
  },
];

export const starterOrders: Order[] = [
  {
    id: "ord-1001",
    userEmail: "customer@phantom.com",
    items: [
      { productId: "p1", quantity: 1, price: 98000 },
      { productId: "p3", quantity: 1, price: 68000 },
    ],
    total: 166000,
    status: "Shipped",
    trackingNumber: "PHG-1024",
    createdAt: "2026-07-01T10:00:00.000Z",
    address: "10 Broad Street, Lagos",
    paymentStatus: "Paid",
  },
];

export const starterUsers: User[] = [
  {
    id: "admin-1",
    name: "Aisha Admin",
    email: "admin@phantom.com",
    password: "admin123",
    role: "admin",
    address: "8 Market Road, Abuja",
    phone: "08012345678",
  },
  {
    id: "cust-1",
    name: "Tobi Customer",
    email: "customer@phantom.com",
    password: "customer123",
    role: "customer",
    address: "20 Allen Avenue, Lagos",
    phone: "08123456789",
  },
];

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);

export const createId = (prefix = "id") => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
