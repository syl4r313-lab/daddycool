"use client";

import { useFormStatus } from "react-dom";
import type { ButtonHTMLAttributes } from "react";

export function SubmitButton({
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center rounded-lg bg-brand-700 px-4 py-2.5 font-medium text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {pending ? "Bitte warten…" : children}
    </button>
  );
}
