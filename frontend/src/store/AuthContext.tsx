"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ApiError, apiFetch } from "@/services/api";

export type AuthUser = { id: string; email: string; firstName: string; lastName: string | null; role: "CUSTOMER" | "ADMIN" };
export type RegisterInput = { email: string; password: string; firstName: string; lastName?: string };

type AuthContextValue = {
  user: AuthUser | null;
  /** false until we have asked the API who is signed in */
  ready: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (input: RegisterInput) => Promise<AuthUser>;
  logout: () => Promise<void>;
  /** Replaces the signed-in user, for example after the profile was edited. */
  refresh: (user: AuthUser) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  // Ask the API who is signed in (the login cookie is HttpOnly, so scripts cannot read it)
  useEffect(() => {
    let cancelled = false;
    apiFetch<{ user: AuthUser }>("/auth/me")
      .then((data) => !cancelled && setUser(data.user))
      .catch(() => !cancelled && setUser(null))
      .finally(() => !cancelled && setReady(true));
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiFetch<{ user: AuthUser }>("/auth/login", { method: "POST", json: { email, password } });
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const data = await apiFetch<{ user: AuthUser }>("/auth/register", { method: "POST", json: input });
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch (error) {
      if (!(error instanceof ApiError)) throw error; // an API error still means we should drop the local session
    }
    setUser(null);
  }, []);

  const refresh = useCallback((next: AuthUser) => setUser(next), []);

  const value = useMemo(() => ({ user, ready, login, register, logout, refresh }), [user, ready, login, register, logout, refresh]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
