import Link from "next/link";
import { notFound } from "next/navigation";
import { requireParticipant } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getWorksheet, type WorksheetAnswers } from "@/lib/worksheets";
import { WorksheetForm } from "@/components/WorksheetForm";

export default async function WorksheetPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  const worksheet = getWorksheet(key);
  if (!worksheet) notFound();

  const participant = await requireParticipant();
  const response = await prisma.worksheetResponse.findUnique({
    where: {
      participantId_worksheetKey: {
        participantId: participant.id,
        worksheetKey: key,
      },
    },
  });
  const answers = (response?.answers as WorksheetAnswers | undefined) ?? {};

  return (
    <div className="space-y-4">
      <Link
        href="/programm/mitarbeit"
        className="text-sm text-brand-700 hover:underline"
      >
        ← Alle Arbeitsblätter
      </Link>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-stone-900">
          {worksheet.title}
        </h1>
        <p className="mt-1 text-sm text-stone-600">{worksheet.intro}</p>
        <div className="mt-6">
          <WorksheetForm worksheet={worksheet} answers={answers} />
        </div>
      </div>
    </div>
  );
}
