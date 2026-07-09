import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/auth";
import { CreateStaffForm } from "@/components/CreateStaffForm";
import { ResetStaffPasswordForm } from "@/components/ResetStaffPasswordForm";
import { DeleteStaffButton } from "@/components/DeleteStaffButton";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administration",
  BETREUER: "Betreuung",
};

export default async function BetreuendePage() {
  const current = await requireStaff();
  const staff = await prisma.staff.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="space-y-6">
      <CreateStaffForm />

      <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-200 px-6 py-4">
          <h2 className="font-semibold text-stone-900">
            Betreuende ({staff.length})
          </h2>
        </div>
        <ul className="divide-y divide-stone-100">
          {staff.map((member) => {
            const isSelf = member.id === current.id;
            return (
              <li
                key={member.id}
                className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-stone-900">
                      {member.name}
                    </span>
                    {isSelf && (
                      <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-800">
                        Du
                      </span>
                    )}
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600">
                      {ROLE_LABELS[member.role] ?? member.role}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-stone-600">{member.email}</p>
                </div>
                <div className="flex flex-wrap items-start gap-2">
                  <ResetStaffPasswordForm staffId={member.id} />
                  {!isSelf && (
                    <DeleteStaffButton
                      staffId={member.id}
                      staffName={member.name}
                    />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="text-xs text-stone-500">
        Hinweis: Deinen eigenen Zugang kannst du hier nicht entfernen – so
        bleibt immer mindestens ein Team-Zugang bestehen.
      </p>
    </div>
  );
}
