import { requireParticipant } from "@/lib/auth";
import { logoutParticipantAction } from "@/lib/actions/auth-actions";
import { PortalNav } from "@/components/PortalNav";

const links = [
  { href: "/programm", label: "Übersicht" },
  { href: "/programm/kalender", label: "Kalender" },
  { href: "/programm/kontakt", label: "Kontakt" },
  { href: "/programm/mitarbeit", label: "Mitarbeit" },
];

export default async function ProgrammLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const participant = await requireParticipant();

  return (
    <div className="min-h-screen bg-stone-50">
      <PortalNav
        title="Mein Programm"
        subtitle="Daddy Cool"
        links={links}
        logoutAction={logoutParticipantAction}
        badge={
          <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-brand-100 px-2 py-0.5 text-sm font-medium text-brand-800">
            {participant.fruitEmoji} {participant.fruitName}
          </span>
        }
      />
      <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
    </div>
  );
}
