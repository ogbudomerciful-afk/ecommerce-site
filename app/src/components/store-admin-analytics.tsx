"use client";

import { useMemo } from "react";
import { TrendingUp, Package, Users, DollarSign, ShoppingBag } from "lucide-react";

type AdminAnalyticsProps = {
  orders: any[];
  products: any[];
  customers: any[];
  revenue: number;
};

export default function AdminAnalytics({ orders, products, customers, revenue }: AdminAnalyticsProps) {
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const avgOrderValue = totalOrders > 0 ? revenue / totalOrders : 0;
  const totalProducts = products.length;
  const lowStockCount = products.filter((p) => p.inventory < 5).length;
  const totalCustomers = customers.filter((c) => c.role === "customer").length;

  const recentOrders = useMemo(() => {
    return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  }, [orders]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Revenue</p>
              <p className="mt-1 text-2xl font-semibold">{revenue.toLocaleString("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 })}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-700"><DollarSign size={20} /></div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Orders</p>
              <p className="mt-1 text-2xl font-semibold">{totalOrders}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700"><ShoppingBag size={20} /></div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Customers</p>
              <p className="mt-1 text-2xl font-semibold">{totalCustomers}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-700"><Users size={20} /></div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Avg. Order Value</p>
              <p className="mt-1 text-2xl font-semibold">{avgOrderValue.toLocaleString("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 })}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700"><TrendingUp size={20} /></div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Order Status</h3>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Delivered</span>
              <span className="font-semibold">{deliveredOrders}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Pending</span>
              <span className="font-semibold">{pendingOrders}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Total Products</span>
              <span className="font-semibold">{totalProducts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Low Stock Items</span>
              <span className="font-semibold">{lowStockCount}</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Recent Orders</h3>
          <div className="mt-4 space-y-3">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-slate-600">No orders yet.</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${order.status === "Delivered" ? "bg-green-100 text-green-700" : order.status === "Pending" ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-700"}`}>
                    {order.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
