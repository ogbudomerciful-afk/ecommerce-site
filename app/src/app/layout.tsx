import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/components/store-toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Phantom Gadgets",
  description: "An ecommerce MVP with authentication, cart, orders, and admin tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-white text-slate-900">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
