"use client";

import { useState } from "react";
import { Search, Trash2, Edit, Plus } from "lucide-react";
import type { Product } from "@/lib/mock-data";

type AdminProductManagerProps = {
  products: Product[];
  onAddProduct: (product: Omit<Product, "id">) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
};

export default function AdminProductManager({ products, onAddProduct, onUpdateProduct, onDeleteProduct }: AdminProductManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: "", price: "", category: "Gadgets", inventory: "", description: "", image: "", badge: "" });

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category))).sort()];

  const filteredProducts = products.filter((p) => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.category.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedCategory !== "All" && p.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name: form.name,
      price: Number(form.price),
      category: form.category,
      inventory: Number(form.inventory),
      description: form.description,
      image: form.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
      badge: form.badge || undefined,
    };

    if (editingProduct) {
      onUpdateProduct({ ...productData, id: editingProduct.id });
      setEditingProduct(null);
    } else {
      onAddProduct(productData);
    }
    setForm({ name: "", price: "", category: "Gadgets", inventory: "", description: "", image: "", badge: "" });
    setIsAdding(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      price: String(product.price),
      category: product.category,
      inventory: String(product.inventory),
      description: product.description,
      image: product.image,
      badge: product.badge || "",
    });
    setIsAdding(true);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-semibold">Product Management</h2>
        <button onClick={() => { setIsAdding(!isAdding); setEditingProduct(null); setForm({ name: "", price: "", category: "Gadgets", inventory: "", description: "", image: "", badge: "" }); }} className="flex items-center gap-2 rounded-full bg-teal-500 px-4 py-2 text-sm font-semibold text-black">
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border border-slate-200 p-4 space-y-3">
          <h3 className="font-semibold">{editingProduct ? "Edit Product" : "New Product"}</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Product name" className="rounded-full border border-slate-300 px-4 py-2 text-sm" />
            <input required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price" className="rounded-full border border-slate-300 px-4 py-2 text-sm" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-full border border-slate-300 px-4 py-2 text-sm">
              <option value="Audio">Audio</option>
              <option value="Wearables">Wearables</option>
              <option value="Accessories">Accessories</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Photography">Photography</option>
              <option value="Computing">Computing</option>
              <option value="Storage">Storage</option>
              <option value="Networking">Networking</option>
              <option value="Displays">Displays</option>
            </select>
            <input required type="number" value={form.inventory} onChange={(e) => setForm({ ...form, inventory: e.target.value })} placeholder="Stock" className="rounded-full border border-slate-300 px-4 py-2 text-sm" />
            <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Image URL" className="md:col-span-2 rounded-full border border-slate-300 px-4 py-2 text-sm" />
            <input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="Badge (optional)" className="rounded-full border border-slate-300 px-4 py-2 text-sm" />
            <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="md:col-span-2 min-h-20 rounded-2xl border border-slate-300 px-4 py-2 text-sm" />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-full bg-teal-500 px-4 py-2 text-sm font-semibold text-black">{editingProduct ? "Update" : "Add"} Product</button>
            <button type="button" onClick={() => { setIsAdding(false); setEditingProduct(null); }} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Cancel</button>
          </div>
        </form>
      )}

      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-full border border-slate-300 pl-9 pr-4 py-2 text-sm focus:border-teal-500 focus:outline-none md:w-64" />
        </div>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="rounded-full border border-slate-300 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none">
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="pb-2 font-semibold text-slate-600">Product</th>
              <th className="pb-2 font-semibold text-slate-600">Category</th>
              <th className="pb-2 font-semibold text-slate-600">Price</th>
              <th className="pb-2 font-semibold text-slate-600">Stock</th>
              <th className="pb-2 font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-lg bg-slate-100">
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                    </div>
                    <span className="font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="py-3 text-slate-600">{product.category}</td>
                <td className="py-3 font-semibold">{product.price.toLocaleString("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 })}</td>
                <td className="py-3">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${product.inventory > 10 ? "bg-green-100 text-green-700" : product.inventory > 0 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                    {product.inventory}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(product)} className="text-slate-400 hover:text-teal-600"><Edit size={16} /></button>
                    <button onClick={() => onDeleteProduct(product.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
