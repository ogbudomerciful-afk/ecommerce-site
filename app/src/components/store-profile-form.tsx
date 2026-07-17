"use client";

import type { User } from "@/lib/mock-data";
import type React from "react";

type StoreProfileFormProps = {
  currentUser: User | null;
  form: { name: string; address: string; phone: string };
  onFormChange: (field: string, value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
};

export default function StoreProfileForm({ currentUser, form, onFormChange, onSubmit }: StoreProfileFormProps) {
  if (!currentUser) {
    return null;
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <input value={form.name} onChange={(event) => onFormChange("name", event.target.value)} className="w-full rounded-full border border-slate-300 px-4 py-3" placeholder="Name" />
      <input value={form.phone} onChange={(event) => onFormChange("phone", event.target.value)} className="w-full rounded-full border border-slate-300 px-4 py-3" placeholder="Phone" />
      <textarea value={form.address} onChange={(event) => onFormChange("address", event.target.value)} className="min-h-24 w-full rounded-2xl border border-slate-300 px-4 py-3" placeholder="Address" />
      <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
        Want to demo the admin workspace? Use admin@phantom.com with password admin123.
      </div>
      <button type="submit" className="rounded-full bg-black px-5 py-3 font-semibold text-white">
        Save profile
      </button>
    </form>
  );
}
