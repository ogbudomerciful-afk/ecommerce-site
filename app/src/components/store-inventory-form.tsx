"use client";

import type React from "react";

type StoreInventoryFormProps = {
  form: { name: string; price: string; category: string; inventory: string; description: string };
  onFormChange: (field: string, value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  fileRef: React.RefObject<HTMLInputElement | null>;
};

export default function StoreInventoryForm({ form, onFormChange, onSubmit, fileRef }: StoreInventoryFormProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold">Add inventory</h2>
      <form onSubmit={onSubmit} className="mt-4 grid gap-3 md:grid-cols-2">
        <input required value={form.name} onChange={(event) => onFormChange("name", event.target.value)} className="rounded-full border border-slate-300 px-4 py-3" placeholder="Product name" />
        <input required type="number" value={form.price} onChange={(event) => onFormChange("price", event.target.value)} className="rounded-full border border-slate-300 px-4 py-3" placeholder="Price" />
        <input required value={form.category} onChange={(event) => onFormChange("category", event.target.value)} className="rounded-full border border-slate-300 px-4 py-3" placeholder="Category" />
        <input required type="number" value={form.inventory} onChange={(event) => onFormChange("inventory", event.target.value)} className="rounded-full border border-slate-300 px-4 py-3" placeholder="Stock" />
        <input ref={fileRef} type="file" accept="image/*" className="md:col-span-2 rounded-2xl border border-slate-300 px-4 py-3" />
        <textarea required value={form.description} onChange={(event) => onFormChange("description", event.target.value)} className="md:col-span-2 min-h-24 rounded-2xl border border-slate-300 px-4 py-3" placeholder="Description" />
        <button type="submit" className="md:col-span-2 inline-flex items-center justify-center rounded-full bg-teal-500 px-5 py-3 font-semibold text-black">
          Add product
        </button>
      </form>
    </div>
  );
}
