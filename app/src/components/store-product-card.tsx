"use client";

import { useState } from "react";
import type { Product } from "@/lib/mock-data";

type StoreProductCardProps = {
  product: Product;
  onAddToCart: (productId: string) => void;
};

export default function StoreProductCard({ product, onAddToCart }: StoreProductCardProps) {
  const [imgSrc, setImgSrc] = useState(product.image);
  const [imgError, setImgError] = useState(false);

  const fallbackImage = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="relative h-56 w-full bg-slate-100">
        {!imgError ? (
          <img
            src={imgSrc}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover"
            onError={() => {
              setImgSrc(fallbackImage);
              setImgError(true);
            }}
          />
        ) : (
          <img src={fallbackImage} alt={product.name} loading="lazy" className="h-full w-full object-cover" />
        )}
      </div>
      <div className="p-5">
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
    </div>
  );
}
