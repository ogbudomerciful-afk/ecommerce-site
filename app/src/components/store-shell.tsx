"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, LayoutGrid, PackageCheck, ShieldCheck, ShoppingBag, Sparkles, Truck, UserRound, Search } from "lucide-react";
import Link from "next/link";
import {
  createId,
  formatCurrency,
  starterOrders,
  starterProducts,
  starterUsers,
  type CartItem,
  type Order,
  type Product,
  type User,
} from "@/lib/mock-data";
import StoreHeader from "@/components/store-header";
import StoreFooter from "@/components/store-footer";
import StoreAuth from "@/components/store-auth";
import StoreProductCard from "@/components/store-product-card";
import StoreCartItem from "@/components/store-cart-item";
import StoreOrderCard from "@/components/store-order-card";
import StoreAdminStats from "@/components/store-admin-stats";
import StoreInventoryForm from "@/components/store-inventory-form";
import StoreOrderManager from "@/components/store-order-manager";
import StoreSidebar from "@/components/store-sidebar";
import Skeleton from "@/components/store-skeleton";
import StoreProductPage from "@/components/store-product-page";
import StoreCustomerDashboard from "@/components/store-customer-dashboard";
import StoreAdminProducts from "@/components/store-admin-products";
import StoreAdminCustomers from "@/components/store-admin-customers";
import StoreAdminAnalytics from "@/components/store-admin-analytics";
import { useToast } from "@/components/store-toast";

type StoreView = "home" | "catalog" | "cart" | "checkout" | "orders" | "admin" | "profile" | "product" | "business";
type AuthMode = "login" | "signup" | "forgot-password" | "reset-password";

const STORAGE_KEYS = {
  users: "phantom-users",
  currentUser: "phantom-current-user",
  cart: "phantom-cart",
  orders: "phantom-orders",
  products: "phantom-products",
  recentlyViewed: "phantom-recently-viewed",
};

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export default function StoreShell({ view, productId, children }: { view: StoreView; productId?: string; children?: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(starterUsers);
  const [products, setProducts] = useState<Product[]>(starterProducts);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(starterOrders);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "", address: "", token: "" });
  const [profileForm, setProfileForm] = useState({ name: "", address: "", phone: "" });
  const [inventoryForm, setInventoryForm] = useState({ name: "", price: "", category: "Gadgets", inventory: "", description: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "name">("price-asc");
  const [adminTab, setAdminTab] = useState<"overview" | "products" | "orders" | "customers">("overview");
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [authLoading, setAuthLoading] = useState(true);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    setUsers(readStorage(STORAGE_KEYS.users, starterUsers));
    setProducts(readStorage(STORAGE_KEYS.products, starterProducts));
    setCart(readStorage(STORAGE_KEYS.cart, [] as CartItem[]));
    setOrders(readStorage(STORAGE_KEYS.orders, starterOrders));
    setCurrentUser(readStorage<User | null>(STORAGE_KEYS.currentUser, null));
    setRecentlyViewed(readStorage<Product[]>(STORAGE_KEYS.recentlyViewed, []));
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await fetch("/api/auth/me");
        const payload = await response.json();
        if (payload.user) {
          setCurrentUser(payload.user as User);
        }
      } catch {
        // Ignore session restoration failures in demo mode.
      } finally {
        setAuthLoading(false);
      }
    };
    void restoreSession();
  }, []);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const url = currentUser?.role === "admin" ? "/api/orders/list" : `/api/orders/list?email=${encodeURIComponent(currentUser?.email || "")}`;
        const resp = await fetch(url);
        if (!resp.ok) return;
        const json = await resp.json();
        if (json?.orders) {
          const normalized = json.orders.map((o: any) => ({
            id: o._id || o.id || o.tx_ref,
            userEmail: o.userEmail,
            items: o.items,
            total: o.total,
            status: o.status,
            trackingNumber: o.trackingNumber,
            createdAt: o.createdAt,
            address: o.address,
            paymentStatus: o.paymentStatus,
          } as Order));
          setOrders(normalized);
        }
      } catch {
        // ignore load errors
      } finally {
        setLoading(false);
      }
    };
    void loadOrders();
  }, [currentUser]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.users, users);
    writeStorage(STORAGE_KEYS.products, products);
    writeStorage(STORAGE_KEYS.cart, cart);
    writeStorage(STORAGE_KEYS.orders, orders);
    writeStorage(STORAGE_KEYS.currentUser, currentUser);
    writeStorage(STORAGE_KEYS.recentlyViewed, recentlyViewed);
  }, [users, products, cart, orders, currentUser, recentlyViewed]);

  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        name: currentUser.name,
        address: currentUser.address ?? "",
        phone: currentUser.phone ?? "",
      });
    }
  }, [currentUser]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.productId);
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0);
  const customerOrders = useMemo(() => {
    if (!currentUser) return [];
    return orders.filter((order) => order.userEmail === currentUser.email);
  }, [currentUser, orders]);

  const featuredProducts = products.slice(0, 3);
  const lowStockProducts = products.filter((product) => product.inventory < 5);
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const adminView = currentUser?.role === "admin";

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category)));
    return cats.sort();
  }, [products]);

  const bestSellers = useMemo(() => {
    return [...products].sort((a, b) => b.inventory - a.inventory).slice(0, 4);
  }, [products]);

  const newArrivals = useMemo(() => {
    return [...products].sort(() => Math.random() - 0.5).slice(0, 4);
  }, [products]);

  const addToRecentlyViewed = (product: Product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, 8);
    });
  };

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    if (authMode === "forgot-password") {
      try {
        const resp = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: authForm.email }),
        });
        const payload = await resp.json();
        showToast(payload.ok ? "Reset link sent to your email." : payload.error || "Failed to send reset link.", payload.ok ? "success" : "error");
        if (payload.ok) {
          setAuthMode("reset-password");
        }
      } catch {
        showToast("Service unavailable.", "error");
      }
      return;
    }

    if (authMode === "reset-password") {
      try {
        const resp = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: authForm.token, password: authForm.password }),
        });
        const payload = await resp.json();
        showToast(payload.ok ? "Password reset successful. Please login." : payload.error || "Failed to reset password.", payload.ok ? "success" : "error");
        if (payload.ok) {
          setAuthMode("login");
          setAuthForm({ name: "", email: "", password: "", address: "", token: "" });
        }
      } catch {
        showToast("Service unavailable.", "error");
      }
      return;
    }

    const email = authForm.email.trim().toLowerCase();
    const password = authForm.password;

    if (!email || !password) {
      showToast("Please add an email and password.", "error");
      return;
    }

    try {
      const response = await fetch(`/api/auth/${authMode === "signup" ? "register" : "login"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: authForm.name,
          email,
          password,
          address: authForm.address,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        showToast(payload.error || "Authentication failed.", "error");
        return;
      }

      const nextUser: User = {
        id: payload.user.id,
        name: payload.user.name,
        email: payload.user.email,
        password: "",
        role: payload.user.role || "customer",
        address: authForm.address || "",
      };

      setCurrentUser(nextUser);
      setUsers((existingUsers) => (existingUsers.some((entry) => entry.email.toLowerCase() === email) ? existingUsers : [nextUser, ...existingUsers]));
      showToast(authMode === "signup" ? "Account created. Welcome to Phantom Gadgets." : `Welcome back, ${nextUser.name}.`);
      setAuthForm({ name: "", email: "", password: "", address: "", token: "" });
    } catch {
      showToast("Authentication failed. Please try again.", "error");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore logout errors in demo mode.
    }
    setCurrentUser(null);
    showToast("Signed out.");
  };

  const addToCart = (productId: string) => {
    const existing = cart.find((item) => item.productId === productId);
    if (existing) {
      setCart(cart.map((item) => (item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item)));
    } else {
      setCart([...cart, { productId, quantity: 1 }]);
    }
    showToast("Added to cart.");
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (!quantity) {
      setCart(cart.filter((item) => item.productId !== productId));
      return;
    }
    setCart(cart.map((item) => (item.productId === productId ? { ...item, quantity } : item)));
  };

  const handleCheckout = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentUser) {
      showToast("Please sign in before checking out.", "error");
      return;
    }
    if (!cart.length) {
      showToast("Your cart is empty.");
      return;
    }
    try {
      const txRef = createId("tx");
      const orderPayload = {
        tx_ref: txRef,
        userEmail: currentUser.email,
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: products.find((product) => product.id === item.productId)?.price ?? 0,
        })),
        total: cartTotal,
        address: currentUser.address ?? "",
      };

      const createResp = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
      const createJson = await createResp.json();
      if (!createResp.ok) {
        showToast(createJson.error || "Failed to create order.", "error");
        return;
      }

      const response = await fetch("/api/payments/create-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: cartTotal, email: currentUser.email, tx_ref: txRef }),
      });
      const payload = await response.json();

      const order: Order = {
        id: createJson?.order?.id || createId("ord"),
        userEmail: currentUser.email,
        items: orderPayload.items,
        total: cartTotal,
        status: "Processing",
        trackingNumber: `PHG-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        address: orderPayload.address || "No address saved",
        paymentStatus: payload?.data?.status || "Pending",
      };
      setOrders([order, ...orders]);
      setCart([]);

      try {
        await fetch("/api/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: currentUser.email,
            subject: `Order confirmation — ${order.id}`,
            html: `<p>Thanks for your order. Order id: <strong>${order.id}</strong></p><p>Total: ${formatCurrency(order.total)}</p>`,
          }),
        });
      } catch {
        // ignore email errors
      }

      showToast(payload?.data?.link ? `Order placed. Payment link ready: ${payload.data.link}` : "Order placed successfully. Awaiting payment confirmation.");
    } catch (err) {
      console.error("Checkout error", err);
      showToast("Checkout failed. Please try again.", "error");
    }
  };

  const handleProfileSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentUser) return;
    const updatedUser: User = {
      ...currentUser,
      name: profileForm.name || currentUser.name,
      address: profileForm.address,
      phone: profileForm.phone,
    };
    setUsers(users.map((entry) => (entry.id === currentUser.id ? updatedUser : entry)));
    setCurrentUser(updatedUser);
    showToast("Profile updated.");
  };

  const handleInventorySubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    let imageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80";

    const fileInput = fileRef.current?.files?.[0];
    if (fileInput) {
      try {
        const sigResp = await fetch("/api/cloudinary/signature");
        const sigJson = await sigResp.json();
        if (!sigJson?.demo && sigJson?.uploadUrl) {
          const form = new FormData();
          form.append("file", fileInput);
          form.append("api_key", sigJson.apiKey || "");
          form.append("timestamp", String(sigJson.timestamp));
          form.append("folder", sigJson.folder || "phantom_gadgets");
          form.append("signature", sigJson.signature || "");

          const up = await fetch(sigJson.uploadUrl, { method: "POST", body: form });
          const upJson = await up.json();
          imageUrl = upJson?.secure_url || imageUrl;
        }
      } catch {
        // ignore upload errors
      }
    }

    const newProduct: Product = {
      id: createId("product"),
      name: inventoryForm.name,
      price: Number(inventoryForm.price),
      category: inventoryForm.category,
      inventory: Number(inventoryForm.inventory),
      description: inventoryForm.description,
      image: imageUrl,
      badge: "New",
    };
    setProducts([newProduct, ...products]);
    showToast("Product added to inventory.");
    setInventoryForm({ name: "", price: "", category: "Gadgets", inventory: "", description: "" });
    if (fileRef.current) fileRef.current.value = "";
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status } : order)));
    (async () => {
      try {
        await fetch("/api/orders/update", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, status }),
        });
      } catch {
        // ignore update errors
      }
    })();
  };

  const navItems = [
    { href: "/", label: "Home", icon: LayoutGrid },
    { href: "/catalog", label: "Catalog", icon: ShoppingBag },
    { href: "/cart", label: "Cart", icon: ShoppingBag },
    { href: "/orders", label: "Orders", icon: PackageCheck },
    { href: "/admin", label: "Admin", icon: ShieldCheck },
    { href: "/profile", label: "Profile", icon: UserRound },
  ];

  const handleAuthFormChange = (field: string, value: string) => {
    setAuthForm((prev) => ({ ...prev, [field]: value }));
  };

  const activeHref = view === "home" ? "/" : `/${view}`;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_30%),linear-gradient(135deg,_#f8fbff,_#ffffff)] text-slate-900">
      <StoreHeader cartCount={cartCount} currentUser={currentUser} onLogout={handleLogout} navItems={navItems} activeHref={activeHref} />

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
        <section className="w-full lg:w-2/3">

          {view === "home" ? (
            <>
              <div className="rounded-3xl border border-slate-200 bg-black p-8 text-white shadow-2xl shadow-teal-100/60">
                <div className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-teal-300">
                  <Sparkles size={16} />
                  Technology That Fits Your Lifestyle.
                </div>
                <h1 className="mt-4 max-w-2xl text-4xl font-semibold sm:text-5xl">
                  Shop the latest smartphones, wearables, audio devices, and accessories
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-slate-300">
                  —all carefully selected for quality, value, and performance.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/catalog" className="rounded-full bg-teal-400 px-5 py-3 font-semibold text-black">
                    Browse products
                  </Link>
                  <Link href="/admin" className="rounded-full border border-white/20 px-5 py-3 font-semibold text-white">
                    Open admin view
                  </Link>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Revenue</p>
                  <p className="mt-2 text-2xl font-semibold">{formatCurrency(revenue)}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Orders</p>
                  <p className="mt-2 text-2xl font-semibold">{orders.length}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Low stock</p>
                  <p className="mt-2 text-2xl font-semibold">{lowStockProducts.length}</p>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-2xl font-semibold">Shop by Category</h2>
                <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      href={`/catalog?category=${encodeURIComponent(category)}`}
                      className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm transition hover:border-teal-300 hover:shadow-md"
                    >
                      <p className="text-sm font-semibold text-slate-900">{category}</p>
                      <p className="mt-1 text-xs text-slate-500">{products.filter((p) => p.category === category).length} products</p>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Best Sellers</h2>
                  <Link href="/catalog" className="text-sm font-semibold text-blue-700">See all</Link>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {bestSellers.map((product) => (
                    <StoreProductCard key={product.id} product={product} onAddToCart={addToCart} />
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">New Arrivals</h2>
                  <Link href="/catalog" className="text-sm font-semibold text-blue-700">See all</Link>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {newArrivals.map((product) => (
                    <StoreProductCard key={product.id} product={product} onAddToCart={addToCart} />
                  ))}
                </div>
              </div>

              <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold">Why Shop With Us</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <p className="font-semibold">Secure Checkout</p>
                      <p className="text-sm text-slate-600">SSL encrypted payments with Flutterwave</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                      <Truck size={20} />
                    </div>
                    <div>
                      <p className="font-semibold">Fast Delivery</p>
                      <p className="text-sm text-slate-600">Same-day delivery in Lagos & Abuja</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                      <PackageCheck size={20} />
                    </div>
                    <div>
                      <p className="font-semibold">Easy Returns</p>
                      <p className="text-sm text-slate-600">7-day hassle-free return policy</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Featured Products</h2>
                  <Link href="/catalog" className="text-sm font-semibold text-blue-700">See all</Link>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {featuredProducts.map((product) => (
                    <StoreProductCard key={product.id} product={product} onAddToCart={addToCart} />
                  ))}
                </div>
              </div>
            </>
          ) : null}

          {view === "catalog" ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h1 className="text-3xl font-semibold">Catalog</h1>
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-full border border-slate-300 pl-9 pr-4 py-2 text-sm focus:border-teal-500 focus:outline-none md:w-64"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="rounded-full border border-slate-300 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none"
                  >
                    <option value="All">All Categories</option>
                    {Array.from(new Set(products.map((p) => p.category))).sort().map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "price-asc" | "price-desc" | "name")}
                    className="rounded-full border border-slate-300 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none"
                  >
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name">Name</option>
                  </select>
                </div>
              </div>
              {loading ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <Skeleton className="h-64" />
                  <Skeleton className="h-64" />
                  <Skeleton className="h-64" />
                  <Skeleton className="h-64" />
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {products.map((product) => (
                    <StoreProductCard key={product.id} product={product} onAddToCart={addToCart} />
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {view === "product" && productId ? (
            (() => {
              const product = products.find((p) => p.id === productId);
              if (!product) {
                return (
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-2xl font-semibold">Product not found</h2>
                    <p className="mt-2 text-slate-600">The product you are looking for does not exist.</p>
                  </div>
                );
              }
              if (productId) {
                addToRecentlyViewed(product);
              }
              return (
                <StoreProductPage
                  product={product}
                  relatedProducts={products.filter((p) => p.category === product.category && p.id !== product.id)}
                  onAddToCart={addToCart}
                  allProducts={products}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  currentUserEmail={currentUser?.email}
                />
              );
            })()
          ) : null}

          {view === "business" && children ? (
            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                {children}
              </div>
            </div>
          ) : null}

          {view === "cart" ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold">Shopping cart</h2>
              {cart.length ? (
                <div className="mt-6 space-y-4">
                  {cart.map((item) => {
                    const product = products.find((entry) => entry.id === item.productId);
                    return <StoreCartItem key={item.productId} item={item} product={product} onUpdateQuantity={updateQuantity} />;
                  })}
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>{formatCurrency(cartTotal)}</span>
                    </div>
                    <Link href="/checkout" className="mt-4 inline-flex items-center rounded-full bg-teal-500 px-5 py-3 font-semibold text-black">
                      Proceed to checkout <ArrowRight className="ml-2" size={16} />
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="mt-6 text-slate-600">Your cart is empty. Add a product to get started.</p>
              )}
            </div>
          ) : null}

          {view === "checkout" ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold">Checkout</h2>
              <form onSubmit={handleCheckout} className="mt-6 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Payment</p>
                  <p className="mt-2 text-lg font-semibold">Flutterwave payment link ready for launch</p>
                  <p className="mt-2 text-sm text-slate-600">The checkout flow captures the order and marks the payment as paid in this MVP demo.</p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="font-semibold">Delivery address</p>
                  <p className="mt-2 text-sm text-slate-600">{currentUser?.address ?? "Add a profile address before checkout."}</p>
                </div>
                <button type="submit" className="rounded-full bg-blue-600 px-5 py-3 font-semibold text-white">
                  Confirm order
                </button>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-teal-600" /> SSL Secure</span>
                  <span className="flex items-center gap-1"><Truck size={14} className="text-teal-600" /> Fast Delivery</span>
                  <span className="flex items-center gap-1"><PackageCheck size={14} className="text-teal-600" /> 7-Day Returns</span>
                </div>
              </form>
            </div>
          ) : null}

          {view === "orders" ? (
            loading ? (
              <div className="space-y-4">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </div>
            ) : (
              <div className="space-y-4">
                {customerOrders.length ? (
                  customerOrders.map((order) => <StoreOrderCard key={order.id} order={order} />)
                ) : (
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
                    No orders yet. Complete checkout to see tracking updates here.
                  </div>
                )}
              </div>
            )
          ) : null}

          {view === "admin" ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-2 md:flex-row md:gap-4">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "products", label: "Products" },
                  { id: "orders", label: "Orders" },
                  { id: "customers", label: "Customers" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setAdminTab(tab.id as any)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      adminTab === tab.id ? "bg-teal-500 text-black" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {adminTab === "overview" && (
                <StoreAdminAnalytics orders={orders} products={products} customers={users} revenue={revenue} />
              )}

              {adminTab === "products" && (
                <StoreAdminProducts
                  products={products}
                  onAddProduct={(productData) => {
                    const newProduct = { ...productData, id: createId("product") };
                    setProducts([newProduct, ...products]);
                    showToast("Product added successfully");
                  }}
                  onUpdateProduct={(updatedProduct) => {
                    setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
                    showToast("Product updated successfully");
                  }}
                  onDeleteProduct={(productId) => {
                    setProducts(products.filter((p) => p.id !== productId));
                    showToast("Product deleted successfully");
                  }}
                />
              )}

              {adminTab === "orders" && (
                <div className="space-y-6">
                  <StoreAdminStats revenue={revenue} openOrders={orders.filter((order) => order.status !== "Delivered").length} lowStock={lowStockProducts.length} />
                  <StoreOrderManager orders={orders} onUpdateStatus={updateOrderStatus} />
                </div>
              )}

              {adminTab === "customers" && <StoreAdminCustomers customers={users} />}
            </div>
          ) : null}

          {view === "profile" ? (
            <div>
              {authLoading ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-2xl font-semibold">My Account</h2>
                  <div className="mt-6 space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ) : currentUser ? (
                <StoreCustomerDashboard
                  currentUser={currentUser}
                  products={products}
                  orders={orders}
                  onAddToCart={addToCart}
                />
              ) : (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-2xl font-semibold">My Account</h2>
                  <StoreAuth
                    mode={authMode}
                    form={authForm}
                    onModeChange={(mode) => setAuthMode(mode)}
                    onFormChange={handleAuthFormChange}
                    onSubmit={handleAuth}
                    onForgotPassword={() => setAuthMode("forgot-password")}
                  />
                </div>
              )}
            </div>
          ) : null}
        </section>

        <StoreSidebar adminView={adminView} recentlyViewed={recentlyViewed} />
      </main>
      <StoreFooter />
    </div>
  );
}
