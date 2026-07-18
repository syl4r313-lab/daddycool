import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentStaff } from "@/lib/auth";
import { StaffLoginForm } from "@/components/StaffLoginForm";
import { Logo } from "@/components/Logo";
import { CreatedByCredit } from "@/components/CreatedByCredit";

export default async function TeamLoginPage() {
  const staff = await getCurrentStaff();
  if (staff) redirect("/team");

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-6 flex justify-center">
        <Link href="/" aria-label="Daddy Cool Startseite">
          <Logo iconSize={40} wordmarkClassName="text-2xl" />
        </Link>
      </div>
      <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-stone-900">
          Anmeldung für Betreuende
        </h1>
        <p className="mt-1 text-sm text-stone-600">
          Melde dich mit deinem Team-Zugang an, um Teilnehmende, Termine und
          Nachrichten zu verwalten.
        </p>
        <div className="mt-6">
          <StaffLoginForm />
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-stone-500">
        Du bist Teilnehmer/in des Programms?{" "}
        <Link href="/anmelden/programm" className="font-medium text-brand-700 hover:underline">
          Hier geht es zu deinem Zugang
        </Link>
      </p>

      <CreatedByCredit className="mt-10" />
    </main>
  );
}
