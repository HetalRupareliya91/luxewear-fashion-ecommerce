/** Base URL of the LuxeWear API (set NEXT_PUBLIC_API_URL in production). */
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000").replace(/\/$/, "");

export class ApiError extends Error {
  readonly status: number;
  readonly details?: Record<string, string>;

  constructor(status: number, message: string, details?: Record<string, string>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

type ApiBody<T> = { success?: boolean; data?: T; message?: string; details?: Record<string, string> };

/**
 * Calls `${API_URL}/api${path}` with the login cookie attached and unwraps `{ success, data }`.
 * Throws ApiError (status 0 when the server cannot be reached).
 */
export async function apiFetch<T>(path: string, init: Omit<RequestInit, "body"> & { json?: unknown } = {}): Promise<T> {
  const { json, headers, ...rest } = init;
  let res: Response;
  try {
    res = await fetch(`${API_URL}/api${path}`, {
      ...rest,
      credentials: "include",
      headers: { Accept: "application/json", ...(json !== undefined ? { "Content-Type": "application/json" } : {}), ...headers },
      body: json !== undefined ? JSON.stringify(json) : undefined,
    });
  } catch {
    throw new ApiError(0, "Cannot reach the server. Check your connection and try again.");
  }

  let body: ApiBody<T> | null = null;
  try {
    body = (await res.json()) as ApiBody<T>;
  } catch {
    // not JSON
  }
  if (!res.ok || !body?.success) throw new ApiError(res.status, body?.message ?? "Something went wrong. Please try again.", body?.details);
  return body.data as T;
}
