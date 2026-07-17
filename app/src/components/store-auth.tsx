"use client";

import type { User } from "@/lib/mock-data";

type AuthMode = "login" | "signup" | "forgot-password" | "reset-password";

type StoreAuthProps = {
  mode: AuthMode;
  form: { name: string; email: string; password: string; address: string; token: string };
  onModeChange: (mode: AuthMode) => void;
  onFormChange: (field: string, value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  statusMessage: string;
  onForgotPassword?: () => void;
};

export default function StoreAuth({ mode, form, onModeChange, onFormChange, onSubmit, statusMessage, onForgotPassword }: StoreAuthProps) {
  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">
        Sign in to view your profile, saved addresses, and order history.
      </div>
      <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-slate-200 p-4">
        <div className="flex gap-3">
          <button type="button" onClick={() => onModeChange("login")} className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "login" ? "bg-teal-500 text-black" : "bg-slate-100 text-slate-700"}`}>
            Login
          </button>
          <button type="button" onClick={() => onModeChange("signup")} className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "signup" ? "bg-teal-500 text-black" : "bg-slate-100 text-slate-700"}`}>
            Sign up
          </button>
        </div>
        {mode === "signup" ? (
          <input value={form.name} onChange={(event) => onFormChange("name", event.target.value)} className="w-full rounded-full border border-slate-300 px-4 py-3" placeholder="Your name" />
        ) : null}
        {mode === "reset-password" ? (
          <input value={form.token} onChange={(event) => onFormChange("token", event.target.value)} className="w-full rounded-full border border-slate-300 px-4 py-3" placeholder="Reset token" />
        ) : null}
        <input type="email" value={form.email} onChange={(event) => onFormChange("email", event.target.value)} className="w-full rounded-full border border-slate-300 px-4 py-3" placeholder="Email address" />
        <input type="password" value={form.password} onChange={(event) => onFormChange("password", event.target.value)} className="w-full rounded-full border border-slate-300 px-4 py-3" placeholder="Password" />
        {mode === "signup" ? (
          <input value={form.address} onChange={(event) => onFormChange("address", event.target.value)} className="w-full rounded-full border border-slate-300 px-4 py-3" placeholder="Address" />
        ) : null}
        {mode === "login" && onForgotPassword ? (
          <button type="button" onClick={onForgotPassword} className="w-full text-left text-sm text-teal-600 hover:text-teal-700">
            Forgot password?
          </button>
        ) : null}
        <button type="submit" className="w-full rounded-full bg-blue-600 px-5 py-3 font-semibold text-white">
          {mode === "login" ? "Login" : mode === "signup" ? "Create account" : mode === "forgot-password" ? "Send reset link" : "Reset password"}
        </button>
      </form>
      {statusMessage ? (
        <div className="rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900">
          {statusMessage}
        </div>
      ) : null}
    </div>
  );
}
