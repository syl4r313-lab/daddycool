import { prisma } from "@/lib/prisma";
import { CreateMaterialForm } from "@/components/CreateMaterialForm";
import { DeleteMaterialButton } from "@/components/DeleteMaterialButton";

export default async function TeamMaterialPage() {
  const materials = await prisma.material.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <CreateMaterialForm />

      <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-200 px-6 py-4">
          <h2 className="font-semibold text-stone-900">
            Materialien ({materials.length})
          </h2>
        </div>
        <ul className="divide-y divide-stone-100">
          {materials.map((m) => (
            <li key={m.id} className="flex items-start justify-between gap-4 px-6 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-stone-900">{m.title}</p>
                  {m.category && (
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600">
                      {m.category}
                    </span>
                  )}
                </div>
                {m.description && (
                  <p className="mt-0.5 text-sm text-stone-600">{m.description}</p>
                )}
                {m.url && (
                  <a
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-sm text-teal-700 hover:underline"
                  >
                    {m.url}
                  </a>
                )}
                {m.content && (
                  <p className="mt-1 max-w-2xl whitespace-pre-wrap text-sm text-stone-600">
                    {m.content}
                  </p>
                )}
              </div>
              <DeleteMaterialButton materialId={m.id} />
            </li>
          ))}
          {materials.length === 0 && (
            <li className="px-6 py-8 text-center text-sm text-stone-500">
              Noch kein Material hinterlegt.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
