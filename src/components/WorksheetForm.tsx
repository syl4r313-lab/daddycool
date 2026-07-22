"use client";

import { useActionState, useState } from "react";
import { saveWorksheetAction } from "@/lib/actions/worksheet-actions";
import { SubmitButton } from "@/components/SubmitButton";
import type {
  Worksheet,
  WorksheetAnswers,
  WorksheetField,
} from "@/lib/worksheets";

export function WorksheetForm({
  worksheet,
  answers,
}: {
  worksheet: Worksheet;
  answers: WorksheetAnswers;
}) {
  const action = saveWorksheetAction.bind(null, worksheet.key);
  const [state, formAction] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-6">
      {worksheet.fields.map((field) => (
        <div key={field.key}>
          <label
            htmlFor={field.key}
            className="block text-sm font-medium text-stone-800"
          >
            {field.label}
          </label>
          {field.help && (
            <p className="mt-0.5 text-xs text-stone-500">{field.help}</p>
          )}
          <div className="mt-2">
            {field.type === "scale" ? (
              <ScaleInput field={field} defaultValue={answers[field.key]} />
            ) : (
              <textarea
                id={field.key}
                name={field.key}
                rows={4}
                defaultValue={
                  typeof answers[field.key] === "string"
                    ? (answers[field.key] as string)
                    : ""
                }
                className="w-full rounded-lg border border-stone-400 px-3 py-2 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
              />
            )}
          </div>
        </div>
      ))}

      {state?.success && (
        <p className="rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-800">
          {state.success}
        </p>
      )}
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <SubmitButton>Speichern</SubmitButton>
    </form>
  );
}

function ScaleInput({
  field,
  defaultValue,
}: {
  field: WorksheetField;
  defaultValue: string | number | undefined;
}) {
  const min = field.min ?? 0;
  const max = field.max ?? 10;
  const initial =
    typeof defaultValue === "number"
      ? defaultValue
      : typeof defaultValue === "string" && defaultValue !== ""
        ? Number(defaultValue)
        : null;
  const [value, setValue] = useState<number | null>(
    initial === null || Number.isNaN(initial) ? null : initial,
  );

  const steps: number[] = [];
  for (let i = min; i <= max; i++) steps.push(i);

  return (
    <div>
      <input type="hidden" name={field.key} value={value ?? ""} />
      <div className="flex flex-wrap gap-1.5">
        {steps.map((step) => {
          const selected = value === step;
          return (
            <button
              key={step}
              type="button"
              onClick={() => setValue(step)}
              aria-pressed={selected}
              className={`h-9 w-9 rounded-lg border text-sm font-medium transition ${
                selected
                  ? "border-brand-700 bg-brand-700 text-white"
                  : "border-stone-300 bg-white text-stone-700 hover:border-brand-400"
              }`}
            >
              {step}
            </button>
          );
        })}
      </div>
      {(field.minLabel || field.maxLabel) && (
        <div className="mt-1 flex justify-between text-xs text-stone-500">
          <span>{field.minLabel}</span>
          <span>{field.maxLabel}</span>
        </div>
      )}
    </div>
  );
}
