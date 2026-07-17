"use client";

import Link from "next/link";

export default function StoreFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold">Phantom Gadgets</h3>
            <p className="mt-2 text-sm text-slate-400">Technology That Fits Your Lifestyle.</p>
            <p className="mt-2 text-sm text-slate-400">Premium tech and accessories curated for quality and performance.</p>
          </div>
          <div>
            <h4 className="font-semibold">Shop</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li><Link href="/catalog" className="hover:text-teal-400">All Products</Link></li>
              <li><Link href="/catalog?category=Audio" className="hover:text-teal-400">Audio</Link></li>
              <li><Link href="/catalog?category=Wearables" className="hover:text-teal-400">Wearables</Link></li>
              <li><Link href="/catalog?category=Accessories" className="hover:text-teal-400">Accessories</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Support</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li><Link href="/contact" className="hover:text-teal-400">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-teal-400">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-teal-400">Shipping</Link></li>
              <li><Link href="/refund" className="hover:text-teal-400">Returns</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Legal</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li><Link href="/privacy" className="hover:text-teal-400">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-teal-400">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Phantom Gadgets. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
