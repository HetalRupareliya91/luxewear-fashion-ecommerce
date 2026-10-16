import { apiFetch } from "@/services/api";
import type { AuthUser } from "@/store/AuthContext";

export const updateProfile = (input: { firstName?: string; lastName?: string }) => apiFetch<{ user: AuthUser }>("/auth/me", { method: "PATCH", json: input });

export const changePassword = (input: { currentPassword: string; newPassword: string }) => apiFetch<{ changed: boolean }>("/auth/change-password", { method: "POST", json: input });
