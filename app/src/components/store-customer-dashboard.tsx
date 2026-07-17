"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, MapPin, Heart, Package, User, Settings } from "lucide-react";
import type { Product } from "@/lib/mock-data";

type Address = {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
};

type CustomerDashboardProps = {
  currentUser: { id: string; name: string; email: string; role: string } | null;
  products: Product[];
  orders: any[];
  onAddToCart: (productId: string) => void;
};

export default function CustomerDashboard({ currentUser, products, orders, onAddToCart }: CustomerDashboardProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "addresses" | "wishlist" | "orders">("profile");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [profileForm, setProfileForm] = useState({ name: "", phone: "", address: "" });
  const [addressForm, setAddressForm] = useState({ label: "", street: "", city: "", state: "", zip: "", country: "", isDefault: false });
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        name: currentUser.name,
        phone: "",
        address: "",
      });
    }
  }, [currentUser]);

  const loadWishlist = async () => {
    try {
      const response = await fetch("/api/user/wishlist");
      const data = await response.json();
      if (response.ok) {
        setWishlist(data.wishlist || []);
      }
    } catch {
      // ignore
    }
  };

  const loadAddresses = async () => {
    try {
      const response = await fetch("/api/user/addresses");
      const data = await response.json();
      if (response.ok) {
        setAddresses(data.addresses || []);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (activeTab === "wishlist") loadWishlist();
    if (activeTab === "addresses") loadAddresses();
  }, [activeTab]);

  const handleAddToWishlist = async (productId: string) => {
    try {
      const response = await fetch("/api/user/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await response.json();
      if (response.ok) {
        setWishlist(data.wishlist);
        setStatusMessage("Added to wishlist");
      }
    } catch {
      setStatusMessage("Failed to add to wishlist");
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      const response = await fetch("/api/user/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await response.json();
      if (response.ok) {
        setWishlist(data.wishlist);
        setStatusMessage("Removed from wishlist");
      }
    } catch {
      setStatusMessage("Failed to remove from wishlist");
    }
  };

  const handleAddAddress = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/user/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressForm),
      });
      const data = await response.json();
      if (response.ok) {
        setAddresses(data.addresses);
        setAddressForm({ label: "", street: "", city: "", state: "", zip: "", country: "", isDefault: false });
        setStatusMessage("Address added successfully");
      } else {
        setStatusMessage(data.error || "Failed to add address");
      }
    } catch {
      setStatusMessage("Service unavailable");
    }
  };

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));
  const customerOrders = orders.filter((order) => order.userEmail === currentUser?.email);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "orders", label: "Orders", icon: Package },
  ] as const;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold">My Account</h2>

      <div className="mt-6 flex flex-col gap-2 md:flex-row md:gap-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab.id ? "bg-teal-500 text-black" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {statusMessage ? (
        <div className="mt-4 rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900">{statusMessage}</div>
      ) : null}

      <div className="mt-6">
        {activeTab === "profile" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700">Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="mt-1 w-full rounded-full border border-slate-300 px-4 py-3 focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Phone</label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="mt-1 w-full rounded-full border border-slate-300 px-4 py-3 focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Address</label>
              <textarea
                value={profileForm.address}
                onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-teal-500 focus:outline-none"
                rows={3}
              />
            </div>
            <button className="rounded-full bg-black px-5 py-3 font-semibold text-white">Save Profile</button>
          </div>
        )}

        {activeTab === "addresses" && (
          <div className="space-y-6">
            <form onSubmit={handleAddAddress} className="rounded-2xl border border-slate-200 p-4 space-y-3">
              <h3 className="font-semibold">Add New Address</h3>
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  required
                  value={addressForm.label}
                  onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                  placeholder="Label (e.g., Home, Work)"
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none"
                />
                <input
                  required
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  placeholder="Street Address"
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none"
                />
                <input
                  required
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  placeholder="City"
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none"
                />
                <input
                  required
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                  placeholder="State"
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none"
                />
                <input
                  required
                  value={addressForm.zip}
                  onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
                  placeholder="ZIP Code"
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none"
                />
                <input
                  required
                  value={addressForm.country}
                  onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                  placeholder="Country"
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none"
                />
                <label className="flex items-center gap-2 md:col-span-2">
                  <input
                    type="checkbox"
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm text-slate-600">Set as default address</span>
                </label>
              </div>
              <button type="submit" className="flex items-center gap-2 rounded-full bg-teal-500 px-4 py-2 text-sm font-semibold text-black">
                <Plus size={16} />
                Add Address
              </button>
            </form>

            <div className="space-y-3">
              {addresses.length === 0 ? (
                <p className="text-sm text-slate-600">No addresses saved yet.</p>
              ) : (
                addresses.map((address) => (
                  <div key={address.id} className="flex items-start justify-between rounded-2xl border border-slate-200 p-4">
                    <div>
                      <p className="font-semibold">{address.label}</p>
                      <p className="text-sm text-slate-600">
                        {address.street}, {address.city}, {address.state} {address.zip}, {address.country}
                      </p>
                      {address.isDefault && <span className="text-xs font-semibold text-teal-600">Default</span>}
                    </div>
                    <button className="text-slate-400 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "wishlist" && (
          <div className="space-y-4">
            {wishlistProducts.length === 0 ? (
              <p className="text-sm text-slate-600">Your wishlist is empty.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {wishlistProducts.map((product) => (
                  <div key={product.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="relative h-48 w-full bg-slate-100">
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <p className="text-sm text-slate-600">{product.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-lg font-semibold">{product.price.toLocaleString("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 })}</p>
                        <div className="flex gap-2">
                          <button onClick={() => onAddToCart(product.id)} className="rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white">
                            Add to cart
                          </button>
                          <button onClick={() => handleRemoveFromWishlist(product.id)} className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-4">
            {customerOrders.length === 0 ? (
              <p className="text-sm text-slate-600">No orders yet.</p>
            ) : (
              customerOrders.map((order) => (
                <div key={order.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{order.id}</p>
                      <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="rounded-full bg-teal-100 px-3 py-1 text-sm font-semibold text-teal-700">{order.status}</span>
                  </div>
                  <div className="mt-2 text-sm text-slate-600">Items: {order.items.length} • Total: {order.total.toLocaleString("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 })}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
