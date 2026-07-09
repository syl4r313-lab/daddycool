"use client";

import { useActionState } from "react";
import { loginParticipantAction } from "@/lib/actions/auth-actions";
import { SubmitButton } from "@/components/SubmitButton";

export function ParticipantLoginForm() {
  const [state, formAction] = useActionState(loginParticipantAction, null);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="code" className="block text-sm font-medium text-stone-700">
          Dein Zugangscode
        </label>
        <input
          id="code"
          name="code"
          type="text"
          inputMode="numeric"
          required
          autoComplete="off"
          placeholder="z. B. 482913"
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-center text-lg tracking-widest focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
        />
        <p className="mt-1 text-xs text-stone-500">
          Diesen Code hast du von deiner Betreuungsperson erhalten. Kein Name,
          keine E-Mail nötig.
        </p>
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
