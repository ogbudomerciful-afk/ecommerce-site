"use client";

import { useState, useMemo } from "react";
import { Search, Mail, Shield } from "lucide-react";

type Customer = {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  phone?: string;
  address?: string;
};

type AdminCustomersProps = {
  customers: Customer[];
};

export default function AdminCustomers({ customers }: AdminCustomersProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return customers;
    const query = searchQuery.toLowerCase();
    return customers.filter((c) => c.name.toLowerCase().includes(query) || c.email.toLowerCase().includes(query));
  }, [customers, searchQuery]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-semibold">Customers</h2>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search customers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-full border border-slate-300 pl-9 pr-4 py-2 text-sm focus:border-teal-500 focus:outline-none md:w-64" />
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="pb-2 font-semibold text-slate-600">Name</th>
              <th className="pb-2 font-semibold text-slate-600">Email</th>
              <th className="pb-2 font-semibold text-slate-600">Phone</th>
              <th className="pb-2 font-semibold text-slate-600">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCustomers.map((customer) => (
              <tr key={customer.id}>
                <td className="py-3 font-medium">{customer.name}</td>
                <td className="py-3 text-slate-600">{customer.email}</td>
                <td className="py-3 text-slate-600">{customer.phone || "—"}</td>
                <td className="py-3">
                  <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${customer.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-700"}`}>
                    {customer.role === "admin" ? <Shield size={12} /> : <Mail size={12} />}
                    {customer.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
