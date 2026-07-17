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
  {
    id: "p5",
    name: "Phantom Earbuds",
    price: 45000,
    category: "Audio",
    description: "Wireless earbuds with deep bass and 24h battery.",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80",
    inventory: 25,
  },
  {
    id: "p6",
    name: "Titan Fitness Band",
    price: 32000,
    category: "Wearables",
    description: "Lightweight fitness tracker with heart rate monitor.",
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=900&q=80",
    inventory: 18,
  },
  {
    id: "p7",
    name: "Nebula Charger",
    price: 18000,
    category: "Accessories",
    description: "65W GaN fast charger for laptop and phone.",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=80",
    inventory: 40,
  },
  {
    id: "p8",
    name: "Echo Speaker",
    price: 55000,
    category: "Audio",
    description: "Portable Bluetooth speaker with 360° sound.",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80",
    inventory: 15,
  },
  {
    id: "p9",
    name: "Prism Monitor",
    price: 185000,
    category: "Displays",
    description: "27-inch 4K HDR display with USB-C hub.",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80",
    inventory: 7,
    badge: "New",
  },
  {
    id: "p10",
    name: "Flux SSD 1TB",
    price: 72000,
    category: "Storage",
    description: "NVMe SSD with read speeds up to 7,000 MB/s.",
    image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=900&q=80",
    inventory: 30,
  },
  {
    id: "p11",
    name: "Arc Mouse",
    price: 24000,
    category: "Accessories",
    description: "Ergonomic wireless mouse with silent clicks.",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80",
    inventory: 22,
  },
  {
    id: "p12",
    name: "Vertex Router",
    price: 48000,
    category: "Networking",
    description: "WiFi 6E mesh router for whole-home coverage.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80",
    inventory: 12,
  },
  {
    id: "p13",
    name: "Lens Action Camera",
    price: 95000,
    category: "Photography",
    description: "4K60 action camera with HyperSmooth stabilization.",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80",
    inventory: 9,
  },
  {
    id: "p14",
    name: "Cipher Pad",
    price: 38000,
    category: "Accessories",
    description: "Paper-like tablet for writing and sketching.",
    image: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=900&q=80",
    inventory: 14,
  },
  {
    id: "p15",
    name: "Drone Mini 3",
    price: 210000,
    category: "Photography",
    description: "Foldable drone with 4K HDR and 30-min flight time.",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=900&q=80",
    inventory: 4,
    badge: "Limited",
  },
  {
    id: "p16",
    name: "Core Fitness Tracker",
    price: 28000,
    category: "Wearables",
    description: "Slim band with SpO2 and sleep tracking.",
    image: "https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?auto=format&fit=crop&w=900&q=80",
    inventory: 35,
  },
  {
    id: "p17",
    name: "Vibe Soundbar",
    price: 67000,
    category: "Audio",
    description: "2.1 channel soundbar with wireless subwoofer.",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80",
    inventory: 11,
  },
  {
    id: "p18",
    name: "Spark Tablet",
    price: 145000,
    category: "Computing",
    description: "11-inch Android tablet with 128GB storage.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80",
    inventory: 8,
  },
  {
    id: "p19",
    name: "Stealth Keyboard",
    price: 95000,
    category: "Accessories",
    description: "Mechanical wireless keyboard with RGB lighting.",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=900&q=80",
    inventory: 16,
  },
  {
    id: "p20",
    name: "Pixel Stand",
    price: 22000,
    category: "Accessories",
    description: "Wireless charging stand with fast charge mode.",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=900&q=80",
    inventory: 28,
  },
  {
    id: "p21",
    name: "Nano Cam",
    price: 42000,
    category: "Photography",
    description: "Compact webcam with 2K resolution and ring light.",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=900&q=80",
    inventory: 19,
  },
  {
    id: "p22",
    name: "Bolt Power Bank",
    price: 16000,
    category: "Accessories",
    description: "20000mAh power bank with 65W PD output.",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=900&q=80",
    inventory: 45,
  },
  {
    id: "p23",
    name: "Glide Pen Tablet",
    price: 52000,
    category: "Accessories",
    description: "Graphics tablet with 8192 pressure levels.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=900&q=80",
    inventory: 10,
  },
  {
    id: "p24",
    name: "Hub Dock",
    price: 34000,
    category: "Accessories",
    description: "8-in-1 USB-C hub with HDMI and SD card reader.",
    image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=900&q=80",
    inventory: 23,
  },
  {
    id: "p25",
    name: "Wave Mic",
    price: 39000,
    category: "Audio",
    description: "USB condenser microphone with pop filter.",
    image: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=900&q=80",
    inventory: 17,
  },
  {
    id: "p26",
    name: "Drone Air 2",
    price: 175000,
    category: "Photography",
    description: "Lightweight drone with 3-axis gimbal camera.",
    image: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=900&q=80",
    inventory: 6,
    badge: "Hot",
  },
  {
    id: "p27",
    name: "Flex Tripod",
    price: 14000,
    category: "Photography",
    description: "Flexible tripod with remote shutter and phone mount.",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
    inventory: 33,
  },
  {
    id: "p28",
    name: "Card Reader Pro",
    price: 12000,
    category: "Accessories",
    description: "USB 3.0 card reader for CFexpress and SD.",
    image: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&w=900&q=80",
    inventory: 50,
  },
  {
    id: "p29",
    name: "Neon Desk Lamp",
    price: 21000,
    category: "Lifestyle",
    description: "LED desk lamp with wireless charger base.",
    image: "https://images.unsplash.com/photo-1513506003011-3b03c8013e6f?auto=format&fit=crop&w=900&q=80",
    inventory: 21,
  },
  {
    id: "p30",
    name: "Pulse Smart Scale",
    price: 26000,
    category: "Wearables",
    description: "Body composition scale with app sync.",
    image: "https://images.unsplash.com/photo-1576678927484-cc9079540882?auto=format&fit=crop&w=900&q=80",
    inventory: 27,
  },
  {
    id: "p31",
    name: "Orbit USB Hub",
    price: 19000,
    category: "Accessories",
    description: "7-port USB 3.0 hub with individual switches.",
    image: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=900&q=80",
    inventory: 31,
  },
  {
    id: "p32",
    name: "Voyager Backpack",
    price: 52000,
    category: "Lifestyle",
    description: "Anti-theft backpack with USB charging port.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
    inventory: 13,
    badge: "New",
  },
  {
    id: "p33",
    name: "Crystal Earbuds",
    price: 35000,
    category: "Audio",
    description: "Transparent wireless earbuds with ANC.",
    image: "https://images.unsplash.com/photo-1631749700740-11e2b5a2a6e2?auto=format&fit=crop&w=900&q=80",
    inventory: 24,
  },
  {
    id: "p34",
    name: "Zen Mouse Pad",
    price: 8000,
    category: "Accessories",
    description: "Extended mouse pad with smooth fabric surface.",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=900&q=80",
    inventory: 60,
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

export const randomString = (prefix = "token") => `${prefix}-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
