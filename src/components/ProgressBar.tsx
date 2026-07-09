export function ProgressBar({ percent }: { percent: number }) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-stone-200">
      <div
        className="h-full rounded-full bg-brand-600 transition-all"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
