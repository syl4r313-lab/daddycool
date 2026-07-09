"use client";

import { useActionState, useRef, useEffect } from "react";
import { createMaterialAction } from "@/lib/actions/material-actions";
import { SubmitButton } from "@/components/SubmitButton";

export function CreateMaterialForm() {
  const [state, formAction] = useActionState(createMaterialAction, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state === null) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="font-semibold text-stone-900">Material hinzufügen</h2>
      <form ref={formRef} action={formAction} className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-stone-700">
            Titel
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-stone-700">
            Kategorie (optional)
          </label>
          <input
            id="category"
            name="category"
            type="text"
            placeholder="z. B. Arbeitsblatt"
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-stone-700">
            Kurzbeschreibung (optional)
          </label>
          <input
            id="description"
            name="description"
            type="text"
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
          />
        </div>
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-stone-700">
            Link (optional)
          </label>
          <input
            id="url"
            name="url"
            type="url"
            placeholder="https://…"
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="content" className="block text-sm font-medium text-stone-700">
            Text zum Nachlesen (optional, alternativ zum Link)
          </label>
          <textarea
            id="content"
            name="content"
            rows={4}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
          />
        </div>
        {state?.error && (
          <p className="sm:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </p>
        )}
        <div className="sm:col-span-2">
          <SubmitButton>Material speichern</SubmitButton>
        </div>
      </form>
    </div>
  );
}
