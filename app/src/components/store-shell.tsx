"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ChartColumnIncreasing,
  LayoutGrid,
  PackageCheck,
  PlusCircle,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  UserRound,
} from "lucide-react";
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

type StoreView = "home" | "catalog" | "cart" | "checkout" | "orders" | "admin" | "profile";

const STORAGE_KEYS = {
  users: "phantom-users",
  currentUser: "phantom-current-user",
  cart: "phantom-cart",
  orders: "phantom-orders",
  products: "phantom-products",
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

export default function StoreShell({ view }: { view: StoreView }) {
  const [users, setUsers] = useState<User[]>(starterUsers);
  const [products, setProducts] = useState<Product[]>(starterProducts);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(starterOrders);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "", address: "" });
  const [profileForm, setProfileForm] = useState({ name: "", address: "", phone: "" });
  const [inventoryForm, setInventoryForm] = useState({ name: "", price: "", category: "Gadgets", inventory: "", description: "" });
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    setUsers(readStorage(STORAGE_KEYS.users, starterUsers));
    setProducts(readStorage(STORAGE_KEYS.products, starterProducts));
    setCart(readStorage(STORAGE_KEYS.cart, [] as CartItem[]));
    setOrders(readStorage(STORAGE_KEYS.orders, starterOrders));
    setCurrentUser(readStorage<User | null>(STORAGE_KEYS.currentUser, null));
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
      }
    };

    void restoreSession();
  }, []);

  // Fetch server-side orders when user or admin view changes
  useEffect(() => {
    const loadOrders = async () => {
      try {
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
  }, [users, products, cart, orders, currentUser]);

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

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    const email = authForm.email.trim().toLowerCase();
    const password = authForm.password;

    if (!email || !password) {
      setStatusMessage("Please add an email and password.");
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
        setStatusMessage(payload.error || "Authentication failed.");
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
      setStatusMessage(authMode === "signup" ? "Account created. Welcome to Phantom Gadgets." : `Welcome back, ${nextUser.name}.`);
      setAuthForm({ name: "", email: "", password: "", address: "" });
    } catch {
      setStatusMessage("Authentication failed. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore logout errors in demo mode.
    }
    setCurrentUser(null);
    setStatusMessage("Signed out.");
  };

  const addToCart = (productId: string) => {
    const existing = cart.find((item) => item.productId === productId);
    if (existing) {
      setCart(cart.map((item) => (item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item)));
    } else {
      setCart([...cart, { productId, quantity: 1 }]);
    }
    setStatusMessage("Added to cart.");
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
      setStatusMessage("Please sign in before checking out.");
      return;
    }
    if (!cart.length) {
      setStatusMessage("Your cart is empty.");
      return;
    }
    try {
      // Create server-side order first
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
        setStatusMessage(createJson.error || "Failed to create order.");
        return;
      }

      // Request payment link
      const response = await fetch("/api/payments/create-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: cartTotal, email: currentUser.email, tx_ref: txRef }),
      });
      const payload = await response.json();

      // Add local order view
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

      // Send confirmation email (best-effort)
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

      setStatusMessage(payload?.data?.link ? `Order placed. Payment link ready: ${payload.data.link}` : "Order placed successfully. Awaiting payment confirmation.");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Checkout error", err);
      setStatusMessage("Checkout failed. Please try again.");
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
    setStatusMessage("Profile updated.");
  };

  const handleInventorySubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    let imageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80";

    // If a file input is present and Cloudinary is configured, upload it
    const fileInput = (document.getElementById("product-image") as HTMLInputElement | null)?.files?.[0];
    if (fileInput) {
      try {
        const sigResp = await fetch("/api/cloudinary/signature");
        const sigJson = await sigResp.json();
        if (sigJson?.demo) {
          // demo mode — skip upload
        } else if (sigJson?.uploadUrl) {
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
      } catch (e) {
        // ignore upload errors and continue with default image
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
    setStatusMessage("Product added to inventory.");
    setInventoryForm({ name: "", price: "", category: "Gadgets", inventory: "", description: "" });
    // clear file input if present
    const f = document.getElementById("product-image") as HTMLInputElement | null;
    if (f) f.value = "";
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    // Optimistic UI update
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status } : order)));
    (async () => {
      try {
        await fetch("/api/orders/update", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, status }),
        });
      } catch (e) {
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

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_30%),linear-gradient(135deg,_#f8fbff,_#ffffff)] text-slate-900">
      <header className="border-b border-teal-100 bg-black text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-400 text-lg font-semibold text-black">
              P
            </div>
            <div>
              <p className="text-xl font-semibold">Phantom Gadgets</p>
              <p className="text-sm text-teal-200">Fast checkout, smart ops</p>
            </div>
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                 <Link key={item.href} href={item.href} className="flex items-center gap-2 text-sm text-slate-200 transition hover:text-teal-300">
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full border border-teal-400/40 bg-teal-500/10 px-3 py-1 text-sm text-teal-100">
              Cart {cartCount}
            </div>
            {currentUser ? (
              <button onClick={handleLogout} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">
                Logout
              </button>
            ) : (
              <Link href="/profile" className="rounded-full bg-teal-400 px-4 py-2 text-sm font-semibold text-black">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
        <section className="w-full lg:w-2/3">
          {statusMessage ? (
            <div className="mb-6 rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900">
              {statusMessage}
            </div>
          ) : null}

          {view === "home" ? (
            <>
                <div className="rounded-3xl border border-slate-200 bg-black p-8 text-white shadow-2xl shadow-teal-100/60">
                  <div className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-teal-300">
                  <Sparkles size={16} />
                  MVP launch ready
                </div>
                <h1 className="mt-4 max-w-2xl text-4xl font-semibold sm:text-5xl">
                  A polished ecommerce MVP with cart, payments, admin tools, and delivery tracking.
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-slate-300">
                  Phantom Gadgets combines stylish storefront design with practical operations for launches and small teams.
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
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Featured products</h2>
                  <Link href="/catalog" className="text-sm font-semibold text-blue-700">See all</Link>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {featuredProducts.map((product) => (
                    <div key={product.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">{product.category}</span>
                        {product.badge ? <span className="text-sm text-teal-600">{product.badge}</span> : null}
                      </div>
                      <h3 className="mt-4 text-xl font-semibold">{product.name}</h3>
                      <p className="mt-2 text-sm text-slate-600">{product.description}</p>
                      <div className="mt-5 flex items-center justify-between">
                        <p className="text-lg font-semibold">{formatCurrency(product.price)}</p>
                        <button onClick={() => addToCart(product.id)} className="rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white">
                          Add to cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}

          {view === "catalog" ? (
            <div className="grid gap-4 md:grid-cols-2">
              {products.map((product) => (
                <div key={product.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">{product.category}</span>
                    <span className="text-sm text-slate-500">{product.inventory} in stock</span>
                  </div>
                  <h2 className="mt-4 text-xl font-semibold">{product.name}</h2>
                  <p className="mt-2 text-sm text-slate-600">{product.description}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <p className="text-lg font-semibold">{formatCurrency(product.price)}</p>
                    <button onClick={() => addToCart(product.id)} className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                      Add to cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {view === "cart" ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold">Shopping cart</h2>
              {cart.length ? (
                <div className="mt-6 space-y-4">
                  {cart.map((item) => {
                    const product = products.find((entry) => entry.id === item.productId);
                    if (!product) return null;
                    return (
                      <div key={item.productId} className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-slate-500">{formatCurrency(product.price)} each</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(event) => updateQuantity(item.productId, Number(event.target.value))}
                            className="w-20 rounded-full border border-slate-300 px-3 py-2"
                          />
                          <span className="font-semibold">{formatCurrency(product.price * item.quantity)}</span>
                        </div>
                      </div>
                    );
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
              </form>
            </div>
          ) : null}

          {view === "orders" ? (
            <div className="space-y-4">
              {customerOrders.length ? (
                customerOrders.map((order) => (
                  <div key={order.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold">{order.id}</p>
                        <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="rounded-full bg-teal-100 px-3 py-1 text-sm font-semibold text-teal-700">{order.status}</div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                      <Truck size={16} className="text-blue-600" />
                      Tracking: {order.trackingNumber}
                    </div>
                    <div className="mt-3 text-sm text-slate-600">Items: {order.items.length} • Total: {formatCurrency(order.total)}</div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
                  No orders yet. Complete checkout to see tracking updates here.
                </div>
              )}
            </div>
          ) : null}

          {view === "admin" ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-teal-600">
                    <ChartColumnIncreasing size={18} />
                    <p className="text-sm font-semibold">Sales</p>
                  </div>
                  <p className="mt-3 text-2xl font-semibold">{formatCurrency(revenue)}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-blue-600">
                    <PackageCheck size={18} />
                    <p className="text-sm font-semibold">Open orders</p>
                  </div>
                  <p className="mt-3 text-2xl font-semibold">{orders.filter((order) => order.status !== "Delivered").length}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-teal-600">
                    <Settings size={18} />
                    <p className="text-sm font-semibold">Inventory alerts</p>
                  </div>
                  <p className="mt-3 text-2xl font-semibold">{lowStockProducts.length}</p>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold">Add inventory</h2>
                <form onSubmit={handleInventorySubmit} className="mt-4 grid gap-3 md:grid-cols-2">
                  <input required value={inventoryForm.name} onChange={(event) => setInventoryForm({ ...inventoryForm, name: event.target.value })} className="rounded-full border border-slate-300 px-4 py-3" placeholder="Product name" />
                  <input required type="number" value={inventoryForm.price} onChange={(event) => setInventoryForm({ ...inventoryForm, price: event.target.value })} className="rounded-full border border-slate-300 px-4 py-3" placeholder="Price" />
                  <input required value={inventoryForm.category} onChange={(event) => setInventoryForm({ ...inventoryForm, category: event.target.value })} className="rounded-full border border-slate-300 px-4 py-3" placeholder="Category" />
                  <input required type="number" value={inventoryForm.inventory} onChange={(event) => setInventoryForm({ ...inventoryForm, inventory: event.target.value })} className="rounded-full border border-slate-300 px-4 py-3" placeholder="Stock" />
                  <input id="product-image" type="file" accept="image/*" className="md:col-span-2 rounded-2xl border border-slate-300 px-4 py-3" />
                  <textarea required value={inventoryForm.description} onChange={(event) => setInventoryForm({ ...inventoryForm, description: event.target.value })} className="md:col-span-2 min-h-24 rounded-2xl border border-slate-300 px-4 py-3" placeholder="Description" />
                  <button type="submit" className="md:col-span-2 inline-flex items-center justify-center rounded-full bg-teal-500 px-5 py-3 font-semibold text-black">
                    <PlusCircle className="mr-2" size={16} /> Add product
                  </button>
                </form>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold">Manage orders</h2>
                <div className="mt-4 space-y-3">
                  {orders.map((order) => (
                    <div key={order.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-semibold">{order.id}</p>
                        <p className="text-sm text-slate-500">{order.userEmail}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <select value={order.status} onChange={(event) => updateOrderStatus(order.id, event.target.value as Order["status"])} className="rounded-full border border-slate-300 px-3 py-2">
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <span className="text-sm font-semibold">{formatCurrency(order.total)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {view === "profile" ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold">Profile settings</h2>
              {currentUser ? (
                <form onSubmit={handleProfileSubmit} className="mt-6 space-y-4">
                  <input value={profileForm.name} onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })} className="w-full rounded-full border border-slate-300 px-4 py-3" placeholder="Name" />
                  <input value={profileForm.phone} onChange={(event) => setProfileForm({ ...profileForm, phone: event.target.value })} className="w-full rounded-full border border-slate-300 px-4 py-3" placeholder="Phone" />
                  <textarea value={profileForm.address} onChange={(event) => setProfileForm({ ...profileForm, address: event.target.value })} className="min-h-24 w-full rounded-2xl border border-slate-300 px-4 py-3" placeholder="Address" />
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                     Want to demo the admin workspace? Use admin@phantom.com with password admin123.
                  </div>
                  <button type="submit" className="rounded-full bg-black px-5 py-3 font-semibold text-white">
                    Save profile
                  </button>
                </form>
              ) : (
                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">
                    Sign in to view your profile, saved addresses, and order history.
                  </div>
                  <form onSubmit={handleAuth} className="space-y-3 rounded-2xl border border-slate-200 p-4">
                    <div className="flex gap-3">
                        <button type="button" onClick={() => setAuthMode("login")} className={`rounded-full px-4 py-2 text-sm font-semibold ${authMode === "login" ? "bg-teal-500 text-black" : "bg-slate-100 text-slate-700"}`}>
                        Login
                      </button>
                        <button type="button" onClick={() => setAuthMode("signup")} className={`rounded-full px-4 py-2 text-sm font-semibold ${authMode === "signup" ? "bg-teal-500 text-black" : "bg-slate-100 text-slate-700"}`}>
                        Sign up
                      </button>
                    </div>
                    {authMode === "signup" ? <input value={authForm.name} onChange={(event) => setAuthForm({ ...authForm, name: event.target.value })} className="w-full rounded-full border border-slate-300 px-4 py-3" placeholder="Your name" /> : null}
                    <input type="email" value={authForm.email} onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })} className="w-full rounded-full border border-slate-300 px-4 py-3" placeholder="Email address" />
                    <input type="password" value={authForm.password} onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })} className="w-full rounded-full border border-slate-300 px-4 py-3" placeholder="Password" />
                    {authMode === "signup" ? <input value={authForm.address} onChange={(event) => setAuthForm({ ...authForm, address: event.target.value })} className="w-full rounded-full border border-slate-300 px-4 py-3" placeholder="Address" /> : null}
                    <button type="submit" className="w-full rounded-full bg-blue-600 px-5 py-3 font-semibold text-white">
                      {authMode === "login" ? "Login" : "Create account"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : null}
        </section>

        <aside className="w-full space-y-4 lg:w-1/3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-teal-700">
              <ShieldCheck size={18} />
              <h3 className="font-semibold">Security and operations</h3>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>• Secure auth with email and password</li>
              <li>• SSL-ready hosting and secure cookies</li>
              <li>• Flutterwave checkout and webhook support</li>
              <li>• Cloudinary-ready media and Resend email flows</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-black p-5 text-white shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-teal-300">Quick actions</p>
            <div className="mt-4 space-y-3">
              <Link href="/catalog" className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                <span>Explore catalog</span>
                <ArrowRight size={16} />
              </Link>
              <Link href="/orders" className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                <span>View deliveries</span>
                <ArrowRight size={16} />
              </Link>
              {adminView ? (
                <Link href="/admin" className="flex items-center justify-between rounded-2xl border border-teal-400/40 bg-teal-500/10 px-4 py-3">
                  <span>Open admin dashboard</span>
                  <ArrowRight size={16} />
                </Link>
              ) : null}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
