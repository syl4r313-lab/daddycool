"use client";

import { useActionState, useEffect, useRef } from "react";
import { sendFeedbackAction } from "@/lib/actions/feedback-actions";
import { SubmitButton } from "@/components/SubmitButton";

export function FeedbackForm() {
  const [state, formAction] = useActionState(sendFeedbackAction, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-2">
      <textarea
        name="body"
        rows={5}
        required
        placeholder="Dein Feedback an die Betreuenden…"
        className="w-full rounded-lg border border-stone-400 px-3 py-2 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
      />
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-800">
          {state.success}
        </p>
      )}
      <SubmitButton>Feedback senden</SubmitButton>
    </form>
  );
}
