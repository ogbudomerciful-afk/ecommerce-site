"use client";

import type { CartItem } from "@/lib/mock-data";
import type { Product } from "@/lib/mock-data";

type StoreCartItemProps = {
  item: CartItem;
  product: Product | undefined;
  onUpdateQuantity: (productId: string, quantity: number) => void;
};

export default function StoreCartItem({ item, product, onUpdateQuantity }: StoreCartItemProps) {
  if (!product) return null;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-semibold">{product.name}</p>
        <p className="text-sm text-slate-500">{product.price.toLocaleString("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 })} each</p>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(event) => onUpdateQuantity(item.productId, Number(event.target.value))}
          className="w-20 rounded-full border border-slate-300 px-3 py-2"
        />
        <span className="font-semibold">{product.price.toLocaleString("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 })}</span>
      </div>
    </div>
  );
}
