"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import StoreProductCard from "@/components/store-product-card";
import { starterProducts } from "@/lib/mock-data";

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "name">("price-asc");

  const categories = useMemo(() => {
    const cats = Array.from(new Set(starterProducts.map((p) => p.category)));
    return ["All", ...cats.sort()];
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...starterProducts];

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
      result = result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result = result.sort((a, b) => b.price - a.price);
    } else {
      result = result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-semibold">Catalog</h1>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-slate-300 pl-9 pr-4 py-2 text-sm focus:border-teal-500 focus:outline-none md:w-64"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
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
            onChange={(e) => setSortBy(e.target.value as "price-asc" | "price-desc" | "name")}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none"
          >
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredProducts.map((product) => (
            <StoreProductCard key={product.id} product={product} onAddToCart={() => {}} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
          No products found matching your criteria.
        </div>
      )}
    </div>
  );
}
