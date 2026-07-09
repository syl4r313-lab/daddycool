"use client";

import { useActionState } from "react";
import { updateParticipantAction } from "@/lib/actions/participant-actions";
import { SubmitButton } from "@/components/SubmitButton";

export function EditParticipantForm({
  participantId,
  realName,
  notes,
}: {
  participantId: string;
  realName: string | null;
  notes: string | null;
}) {
  const action = updateParticipantAction.bind(null, participantId);
  const [state, formAction] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-3">
      <div>
        <label htmlFor="realName" className="block text-sm font-medium text-stone-700">
          Klarname (intern, optional)
        </label>
        <input
          id="realName"
          name="realName"
          type="text"
          defaultValue={realName ?? ""}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
        />
      </div>
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-stone-700">
          Interne Notiz
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={notes ?? ""}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
        />
      </div>
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-800">
          {state.success}
        </p>
      )}
      <SubmitButton>Speichern</SubmitButton>
    </form>
  );
}
