"use client";

import { useActionState } from "react";
import { createParticipantAction } from "@/lib/actions/participant-actions";
import { SubmitButton } from "@/components/SubmitButton";

export function CreateParticipantForm() {
  const [state, formAction] = useActionState(createParticipantAction, null);

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="font-semibold text-stone-900">Neue Teilnahme anlegen</h2>
      <p className="mt-1 text-sm text-stone-500">
        Es wird automatisch die nächste freie Automarke sowie ein Zugangscode
        vergeben. Der Klarname ist optional und nur für das Team sichtbar.
      </p>
      <form action={formAction} className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="realName" className="block text-sm font-medium text-stone-700">
            Klarname (optional, intern)
          </label>
          <input
            id="realName"
            name="realName"
            type="text"
            className="mt-1 w-full rounded-lg border border-stone-400 px-3 py-2 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
          />
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-stone-700">
            Interne Notiz (optional)
          </label>
          <input
            id="notes"
            name="notes"
            type="text"
            className="mt-1 w-full rounded-lg border border-stone-400 px-3 py-2 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
          />
        </div>
        <div className="sm:col-span-2">
          <SubmitButton>Teilnahme anlegen</SubmitButton>
        </div>
      </form>

      {state?.error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state?.generatedCode && (
        <div className="mt-4 rounded-lg border border-brand-300 bg-brand-50 px-4 py-3">
          <p className="text-sm text-brand-900">
            {state.success} Zugangscode (bitte jetzt notieren und weitergeben,
            er wird nicht erneut angezeigt):
          </p>
          <p className="mt-1 text-2xl font-bold tracking-widest text-brand-900">
            {state.generatedCode}
          </p>
        </div>
      )}
    </div>
  );
}
