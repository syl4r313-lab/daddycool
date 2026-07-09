"use client";

import { useActionState, useRef, useEffect } from "react";
import { sendStaffMessageAction } from "@/lib/actions/message-actions";
import { SubmitButton } from "@/components/SubmitButton";

export function StaffReplyForm({ participantId }: { participantId: string }) {
  const action = sendStaffMessageAction.bind(null, participantId);
  const [state, formAction] = useActionState(action, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state?.error) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-2">
      <textarea
        name="body"
        rows={3}
        required
        placeholder="Antwort schreiben…"
        className="w-full rounded-lg border border-stone-400 px-3 py-2 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
      />
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <SubmitButton>Senden</SubmitButton>
    </form>
  );
}
