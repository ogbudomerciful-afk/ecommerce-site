"use client";

import { ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

type StoreSidebarProps = {
  adminView: boolean;
};

export default function StoreSidebar({ adminView }: StoreSidebarProps) {
  return (
    <aside className="w-full space-y-4 lg:w-1/3">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-teal-700">
          <ShieldCheck size={18} />
          <h3 className="font-semibold">Security and operations</h3>
        </div>
        <ul className="mt-4 space-y-3 text-sm text-slate-600">
          <li>• Secure auth with email and password</li>
          <li>• SSL-ready hosting and secure cookies</li>
          <li>• Flutterwave checkout and webhook support</li>
          <li>• Cloudinary-ready media and Resend email flows</li>
        </ul>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-black p-5 text-white shadow-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-teal-300">Quick actions</p>
        <div className="mt-4 space-y-3">
          <Link href="/catalog" className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
            <span>Explore catalog</span>
            <ArrowRight size={16} />
          </Link>
          <Link href="/orders" className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
            <span>View deliveries</span>
            <ArrowRight size={16} />
          </Link>
          {adminView ? (
            <Link href="/admin" className="flex items-center justify-between rounded-2xl border border-teal-400/40 bg-teal-500/10 px-4 py-3">
              <span>Open admin dashboard</span>
              <ArrowRight size={16} />
            </Link>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
