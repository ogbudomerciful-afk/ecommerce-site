"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowRight, LayoutGrid, PackageCheck, ShieldCheck, ShoppingBag, Sparkles, Truck, UserRound } from "lucide-react";
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
import StoreAuth from "@/components/store-auth";
import StoreProductCard from "@/components/store-product-card";
import StoreCartItem from "@/components/store-cart-item";
import StoreOrderCard from "@/components/store-order-card";
import StoreAdminStats from "@/components/store-admin-stats";
import StoreInventoryForm from "@/components/store-inventory-form";
import StoreOrderManager from "@/components/store-order-manager";
import StoreProfileForm from "@/components/store-profile-form";
import StoreSidebar from "@/components/store-sidebar";
import Skeleton from "@/components/store-skeleton";

type StoreView = "home" | "catalog" | "cart" | "checkout" | "orders" | "admin" | "profile";
type AuthMode = "login" | "signup" | "forgot-password" | "reset-password";

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
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "", address: "", token: "" });
  const [profileForm, setProfileForm] = useState({ name: "", address: "", phone: "" });
  const [inventoryForm, setInventoryForm] = useState({ name: "", price: "", category: "Gadgets", inventory: "", description: "" });
  const [statusMessage, setStatusMessage] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);

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
    if (authMode === "forgot-password") {
      try {
        const resp = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: authForm.email }),
        });
        const payload = await resp.json();
        setStatusMessage(payload.ok ? "Reset link sent to your email." : payload.error || "Failed to send reset link.");
        if (payload.ok) {
          setAuthMode("reset-password");
        }
      } catch {
        setStatusMessage("Service unavailable.");
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
        setStatusMessage(payload.ok ? "Password reset successful. Please login." : payload.error || "Failed to reset password.");
        if (payload.ok) {
          setAuthMode("login");
          setAuthForm({ name: "", email: "", password: "", address: "", token: "" });
        }
      } catch {
        setStatusMessage("Service unavailable.");
      }
      return;
    }

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
      setAuthForm({ name: "", email: "", password: "", address: "", token: "" });
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

      setStatusMessage(payload?.data?.link ? `Order placed. Payment link ready: ${payload.data.link}` : "Order placed successfully. Awaiting payment confirmation.");
    } catch (err) {
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
    setStatusMessage("Product added to inventory.");
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

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_30%),linear-gradient(135deg,_#f8fbff,_#ffffff)] text-slate-900">
      <StoreHeader cartCount={cartCount} currentUser={currentUser} onLogout={handleLogout} navItems={navItems} />

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
                    <StoreProductCard key={product.id} product={product} onAddToCart={addToCart} />
                  ))}
                </div>
              </div>
            </>
          ) : null}

          {view === "catalog" ? (
            loading ? (
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
            )
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
              <StoreAdminStats revenue={revenue} openOrders={orders.filter((order) => order.status !== "Delivered").length} lowStock={lowStockProducts.length} />
              <StoreInventoryForm form={inventoryForm} onFormChange={(field, value) => setInventoryForm((prev) => ({ ...prev, [field]: value }))} onSubmit={handleInventorySubmit} fileRef={fileRef} />
              <StoreOrderManager orders={orders} onUpdateStatus={updateOrderStatus} />
            </div>
          ) : null}

          {view === "profile" ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold">Profile settings</h2>
              {currentUser ? (
                <StoreProfileForm
                  currentUser={currentUser}
                  form={profileForm}
                  onFormChange={(field, value) => setProfileForm((prev) => ({ ...prev, [field]: value }))}
                  onSubmit={handleProfileSubmit}
                  statusMessage={statusMessage}
                />
              ) : (
                <StoreAuth
                  mode={authMode}
                  form={authForm}
                  onModeChange={(mode) => { setAuthMode(mode); setStatusMessage(""); }}
                  onFormChange={handleAuthFormChange}
                  onSubmit={handleAuth}
                  statusMessage={statusMessage}
                  onForgotPassword={() => setAuthMode("forgot-password")}
                />
              )}
            </div>
          ) : null}
        </section>

        <StoreSidebar adminView={adminView} />
      </main>
    </div>
  );
}
