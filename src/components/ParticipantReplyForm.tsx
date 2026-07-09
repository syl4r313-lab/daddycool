"use client";

import { useActionState, useRef, useEffect } from "react";
import { sendParticipantMessageAction } from "@/lib/actions/message-actions";
import { SubmitButton } from "@/components/SubmitButton";

export function ParticipantReplyForm() {
  const [state, formAction] = useActionState(sendParticipantMessageAction, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state === null) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-2">
      <textarea
        name="body"
        rows={3}
        required
        placeholder="Nachricht an die Betreuenden…"
        className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
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
