"use client";

import { useState } from "react";
import { Button } from "@/components/common/Button";
import { FormField } from "@/components/forms/FormField";
import { isEmail, isFilled, type FieldErrors } from "@/utils/validators";

type Values = { name: string; email: string; message: string };

export default function ContactPage() {
  const [values, setValues] = useState<Values>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<FieldErrors<keyof Values>>({});

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const found: FieldErrors<keyof Values> = {};
    if (!isFilled(values.name, 80)) found.name = "Please tell us your name";
    if (!isEmail(values.email)) found.email = "Enter a valid email address";
    if (!isFilled(values.message, 2000)) found.message = "Write a short message";
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const subject = encodeURIComponent(`LuxeWear enquiry from ${values.name.trim()}`);
    const body = encodeURIComponent(`${values.message.trim()}\n\n${values.name.trim()} <${values.email.trim()}>`);
    window.location.href = `mailto:support@luxewear.example?subject=${subject}&body=${body}`;
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">Customer care</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">Contact us</h1>
      <p className="mt-4 text-gray-600">Questions about an order, sizing or returns? Send us a message and we will reply within one business day.</p>
      <form onSubmit={submit} noValidate className="mt-8 space-y-4">
        <FormField label="Name" name="name" value={values.name} error={errors.name} onChange={(e) => setValues({ ...values, name: e.target.value })} />
        <FormField label="Email" name="email" type="email" value={values.email} error={errors.email} onChange={(e) => setValues({ ...values, email: e.target.value })} />
        <div>
          <label htmlFor="message" className="text-sm font-medium">Message</label>
          <textarea id="message" rows={6} value={values.message} onChange={(e) => setValues({ ...values, message: e.target.value })} aria-invalid={errors.message ? true : undefined} className={`mt-1 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-black ${errors.message ? "border-red-500" : ""}`} />
          {errors.message ? <p role="alert" className="mt-1 text-sm text-red-600">{errors.message}</p> : null}
        </div>
        <Button type="submit">Send message</Button>
      </form>
    </section>
  );
}
