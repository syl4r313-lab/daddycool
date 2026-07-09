"use client";

import { useActionState } from "react";
import { loginStaffAction } from "@/lib/actions/auth-actions";
import { SubmitButton } from "@/components/SubmitButton";

export function StaffLoginForm() {
  const [state, formAction] = useActionState(loginStaffAction, null);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-stone-700">
          E-Mail-Adresse
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-stone-700">
          Passwort
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
        />
      </div>
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <SubmitButton className="w-full">Anmelden</SubmitButton>
    </form>
  );
}
