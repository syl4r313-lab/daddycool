import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentParticipant } from "@/lib/auth";
import { ParticipantLoginForm } from "@/components/ParticipantLoginForm";

export default async function ProgrammLoginPage() {
  const participant = await getCurrentParticipant();
  if (participant) redirect("/programm");

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-stone-900">
          Dein Zugang zum Programm
        </h1>
        <p className="mt-1 text-sm text-stone-600">
          Gib deinen persönlichen Zugangscode ein. Im Programm wirst du nur
          über deine zugeteilte Frucht angezeigt – nie über deinen Namen.
        </p>
        <div className="mt-6">
          <ParticipantLoginForm />
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-stone-500">
        Du bist Betreuer/in?{" "}
        <Link href="/anmelden/team" className="font-medium text-teal-700 hover:underline">
          Hier geht es zum Team-Bereich
        </Link>
      </p>
    </main>
  );
}
