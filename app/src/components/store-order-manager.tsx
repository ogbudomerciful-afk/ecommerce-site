"use client";

import type { Order } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/mock-data";

type StoreOrderManagerProps = {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: Order["status"]) => void;
};

export default function StoreOrderManager({ orders, onUpdateStatus }: StoreOrderManagerProps) {
  return (
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
              <select value={order.status} onChange={(event) => onUpdateStatus(order.id, event.target.value as Order["status"])} className="rounded-full border border-slate-300 px-3 py-2">
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
  );
}
