"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
};

type AuthState = {
  user: User | null;
  loading: boolean;
};

export function useAuth() {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me");
        const payload = await response.json();
        if (mounted) {
          setState({ user: payload.user, loading: false });
        }
      } catch {
        if (mounted) {
          setState({ user: null, loading: false });
        }
      }
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, [router]);

  return state;
}

export function requireAuth(user: User | null, loading: boolean, redirectTo: string = "/profile?redirect=true") {
  if (loading) return true;
  if (!user) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
}

export function requireAdmin(user: User | null, loading: boolean) {
  if (loading) return true;
  if (!user || user.role !== "admin") {
    window.location.href = "/";
    return false;
  }
  return true;
}
