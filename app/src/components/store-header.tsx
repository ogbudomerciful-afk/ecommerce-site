"use client";

import Link from "next/link";
import { type LucideIcon } from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

type StoreHeaderProps = {
  cartCount: number;
  currentUser: { name: string } | null;
  onLogout: () => void;
  navItems: NavItem[];
};

export default function StoreHeader({ cartCount, currentUser, onLogout, navItems }: StoreHeaderProps) {
  return (
    <header className="border-b border-teal-100 bg-black text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-400 text-lg font-semibold text-black">
            P
          </div>
          <div>
            <p className="text-xl font-semibold">Phantom Gadgets</p>
            <p className="text-sm text-teal-200">Fast checkout, smart ops</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex items-center gap-2 text-sm text-slate-200 transition hover:text-teal-300">
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <div className="rounded-full border border-teal-400/40 bg-teal-500/10 px-3 py-1 text-sm text-teal-100">
            Cart {cartCount}
          </div>
          {currentUser ? (
            <button onClick={onLogout} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">
              Logout
            </button>
          ) : (
            <Link href="/profile" className="rounded-full bg-teal-400 px-4 py-2 text-sm font-semibold text-black">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
