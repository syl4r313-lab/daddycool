"use client";

import { useActionState, useEffect, useRef } from "react";
import { createStaffAction } from "@/lib/actions/staff-actions";
import { SubmitButton } from "@/components/SubmitButton";

export function CreateStaffForm() {
  const [state, formAction] = useActionState(createStaffAction, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="font-semibold text-stone-900">Betreuer:in einladen</h2>
      <p className="mt-1 text-sm text-stone-500">
        Lege E-Mail und Passwort für eine weitere Betreuungsperson fest. Gib die
        Zugangsdaten anschließend direkt an die Person weiter – sie kann sich
        damit sofort im Team-Bereich anmelden.
      </p>
      <form ref={formRef} action={formAction} className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="name" className="block text-sm font-medium text-stone-700">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="off"
            className="mt-1 w-full rounded-lg border border-stone-400 px-3 py-2 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-stone-700">
            E-Mail-Adresse
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="off"
            className="mt-1 w-full rounded-lg border border-stone-400 px-3 py-2 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-stone-700">
            Passwort (mind. 8 Zeichen)
          </label>
          <input
            id="password"
            name="password"
            type="text"
            required
            minLength={8}
            autoComplete="off"
            className="mt-1 w-full rounded-lg border border-stone-400 px-3 py-2 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
          />
        </div>
        {state?.error && (
          <p className="sm:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </p>
        )}
        {state?.success && (
          <p className="sm:col-span-2 rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-800">
            {state.success}
          </p>
        )}
        <div className="sm:col-span-2">
          <SubmitButton>Betreuer:in anlegen</SubmitButton>
        </div>
      </form>
    </div>
  );
}
