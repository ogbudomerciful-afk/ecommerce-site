"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, ShoppingBag, Truck, ShieldCheck, Star, Search } from "lucide-react";
import type { Product } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/mock-data";
import ProductReviews from "@/components/store-product-reviews";

type StoreProductPageProps = {
  product: Product;
  relatedProducts: Product[];
  onAddToCart: (productId: string) => void;
  allProducts: Product[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: "price-asc" | "price-desc" | "name";
  onSortChange: (sort: "price-asc" | "price-desc" | "name") => void;
  currentUserEmail?: string;
};

export default function StoreProductPage({
  product,
  relatedProducts,
  onAddToCart,
  allProducts,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  currentUserEmail,
}: StoreProductPageProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const searchParams = useSearchParams();

  const images = [product.image, product.image, product.image];

  const categories = useMemo(() => {
    const cats = Array.from(new Set(allProducts.map((p) => p.category)));
    return ["All", ...cats.sort()];
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    let result = allProducts.filter((p) => p.id !== product.id);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [allProducts, searchQuery, selectedCategory, sortBy, product.id]);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100">
              <Image src={images[currentImageIndex]} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
            <div className="flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-16 w-16 overflow-hidden rounded-xl border-2 ${
                    currentImageIndex === index ? "border-teal-500" : "border-slate-200"
                  }`}
                >
                  <div className="relative h-full w-full bg-slate-100">
                    <Image src={images[index]} alt={`${product.name} ${index + 1}`} fill className="object-cover" sizes="64px" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">{product.category}</span>
              <h1 className="mt-3 text-3xl font-semibold">{product.name}</h1>
              <p className="mt-2 text-lg text-teal-600">{formatCurrency(product.price)}</p>
            </div>

            <p className="text-slate-600">{product.description}</p>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star size={18} className="fill-yellow-400 text-yellow-400" />
                <Star size={18} className="fill-yellow-400 text-yellow-400" />
                <Star size={18} className="fill-yellow-400 text-yellow-400" />
                <Star size={18} className="fill-yellow-400 text-yellow-400" />
                <Star size={18} className="text-slate-300" />
              </div>
              <span className="text-sm text-slate-500">(128 reviews)</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Truck size={16} className="text-teal-600" />
                Free delivery on orders above ₦50,000
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <ShieldCheck size={16} className="text-teal-600" />
                1-year warranty included
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <ShoppingBag size={16} className="text-teal-600" />
                {product.inventory > 0 ? `${product.inventory} in stock` : "Out of stock"}
              </div>
            </div>

            <button
              onClick={() => onAddToCart(product.id)}
              disabled={product.inventory === 0}
              className="w-full rounded-full bg-teal-600 px-6 py-3 font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {product.inventory > 0 ? "Add to cart" : "Out of stock"}
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-semibold">Related Products</h2>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full rounded-full border border-slate-300 pl-9 pr-4 py-2 text-sm focus:border-teal-500 focus:outline-none md:w-64"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as "price-asc" | "price-desc" | "name")}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none"
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.slice(0, 6).map((relatedProduct) => (
            <div key={relatedProduct.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="relative h-48 w-full bg-slate-100">
                <Image src={relatedProduct.image} alt={relatedProduct.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
              </div>
              <div className="mt-4">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">{relatedProduct.category}</span>
                <h3 className="mt-2 text-lg font-semibold">{relatedProduct.name}</h3>
                <p className="mt-1 text-sm text-slate-600 line-clamp-2">{relatedProduct.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-lg font-semibold">{formatCurrency(relatedProduct.price)}</p>
                  <button onClick={() => onAddToCart(relatedProduct.id)} className="rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white">
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ProductReviews productId={product.id} currentUserEmail={currentUserEmail} />
    </div>
  );
}
