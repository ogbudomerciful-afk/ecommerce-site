"use client";

import { ChartColumnIncreasing, PackageCheck, Settings } from "lucide-react";
import { formatCurrency } from "@/lib/mock-data";

type StoreAdminStatsProps = {
  revenue: number;
  openOrders: number;
  lowStock: number;
};

export default function StoreAdminStats({ revenue, openOrders, lowStock }: StoreAdminStatsProps) {
  return (
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
        <p className="mt-3 text-2xl font-semibold">{openOrders}</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-teal-600">
          <Settings size={18} />
          <p className="text-sm font-semibold">Inventory alerts</p>
        </div>
        <p className="mt-3 text-2xl font-semibold">{lowStock}</p>
      </div>
    </div>
  );
}
