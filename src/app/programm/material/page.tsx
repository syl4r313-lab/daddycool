import { prisma } from "@/lib/prisma";

export default async function ProgrammMaterialPage() {
  const materials = await prisma.material.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-stone-900">Material</h1>
        <p className="text-sm text-stone-500">
          Unterlagen und Links zum Nachlesen zwischen den Sitzungen.
        </p>
      </div>
      <ul className="space-y-3">
        {materials.map((m) => (
          <li key={m.id} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <p className="font-medium text-stone-900">{m.title}</p>
              {m.category && (
                <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600">
                  {m.category}
                </span>
              )}
            </div>
            {m.description && (
              <p className="mt-1 text-sm text-stone-600">{m.description}</p>
            )}
            {m.url && (
              <a
                href={m.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm font-medium text-teal-700 hover:underline"
              >
                Material öffnen →
              </a>
            )}
            {m.content && (
              <p className="mt-2 whitespace-pre-wrap text-sm text-stone-700">
                {m.content}
              </p>
            )}
          </li>
        ))}
        {materials.length === 0 && (
          <li className="rounded-2xl border border-stone-200 bg-white p-8 text-center text-sm text-stone-500 shadow-sm">
            Aktuell ist noch kein Material hinterlegt.
          </li>
        )}
      </ul>
    </div>
  );
}
