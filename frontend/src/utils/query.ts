/** Returns "?a=1&b=2" (or "") after applying updates; empty/undefined values remove the key. */
export function withParams(current: URLSearchParams | string, updates: Record<string, string | undefined>): string {
  const params = new URLSearchParams(typeof current === "string" ? current : current.toString());
  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined || value === "") params.delete(key);
    else params.set(key, value);
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}
