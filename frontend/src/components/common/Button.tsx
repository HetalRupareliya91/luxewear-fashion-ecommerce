import type { ButtonHTMLAttributes, ReactNode } from "react";
export function Button({ children, className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return <button {...props} className={`rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}>{children}</button>;
}
