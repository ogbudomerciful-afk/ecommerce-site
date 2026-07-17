"use client";

import type { Product } from "@/lib/mock-data";

type StoreProductCardProps = {
  product: Product;
  onAddToCart: (productId: string) => void;
};

export default function StoreProductCard({ product, onAddToCart }: StoreProductCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">{product.category}</span>
        {product.badge ? <span className="text-sm text-teal-600">{product.badge}</span> : null}
      </div>
      <h3 className="mt-4 text-xl font-semibold">{product.name}</h3>
      <p className="mt-2 text-sm text-slate-600">{product.description}</p>
      <div className="mt-5 flex items-center justify-between">
        <p className="text-lg font-semibold">{product.price.toLocaleString("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 })}</p>
        <button onClick={() => onAddToCart(product.id)} className="rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white">
          Add to cart
        </button>
      </div>
    </div>
  );
}
