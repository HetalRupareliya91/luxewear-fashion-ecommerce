"use client";

import { useState } from "react";
import { isEmail } from "@/utils/validators";

const KEY = "luxewear.newsletter.v1";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isEmail(email)) {
      setStatus("error");
      return;
    }
    // Stored on this device until the newsletter API exists
    const saved: string[] = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    window.localStorage.setItem(KEY, JSON.stringify([...new Set([...saved, email.trim().toLowerCase()])]));
    setStatus("done");
    setEmail("");
  }

  return (
    <form onSubmit={submit} noValidate className="mx-auto mt-8 max-w-lg">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          aria-label="Email address"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setStatus("idle");
          }}
          placeholder="Your email address"
          className="min-w-0 flex-1 rounded-full px-5 py-3 text-black outline-none"
        />
        <button type="submit" className="rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-200">Subscribe</button>
      </div>
      {status === "error" ? <p role="alert" className="mt-3 text-sm text-red-300">Please enter a valid email address.</p> : null}
      {status === "done" ? <p role="status" className="mt-3 text-sm text-green-300">Thanks for subscribing!</p> : null}
    </form>
  );
}
