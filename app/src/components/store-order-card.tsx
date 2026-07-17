"use client";

import { Truck } from "lucide-react";
import type { Order } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/mock-data";

type StoreOrderCardProps = {
  order: Order;
};

export default function StoreOrderCard({ order }: StoreOrderCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
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
  );
}
