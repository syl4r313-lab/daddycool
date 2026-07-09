"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { resetStaffPasswordAction } from "@/lib/actions/staff-actions";
import { SubmitButton } from "@/components/SubmitButton";

export function ResetStaffPasswordForm({ staffId }: { staffId: string }) {
  const action = resetStaffPasswordAction.bind(null, staffId);
  const [state, formAction] = useActionState(action, null);
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-stone-400 px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-100"
      >
        Passwort ändern
      </button>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-2 sm:flex-row sm:items-start">
      <div>
        <input
          name="password"
          type="text"
          required
          minLength={8}
          placeholder="Neues Passwort (mind. 8)"
          autoComplete="off"
          className="w-full rounded-lg border border-stone-400 px-3 py-2 text-sm focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600 sm:w-56"
        />
        {state?.error && (
          <p className="mt-1 text-xs text-red-700">{state.error}</p>
        )}
        {state?.success && (
          <p className="mt-1 text-xs font-medium text-brand-700">{state.success}</p>
        )}
      </div>
      <div className="flex gap-2">
        <SubmitButton className="text-sm">Speichern</SubmitButton>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg border border-stone-400 px-3 py-2 text-sm text-stone-700 hover:bg-stone-100"
        >
          Abbrechen
        </button>
      </div>
    </form>
  );
}
