import { requireStaff } from "@/lib/auth";
import { logoutStaffAction } from "@/lib/actions/auth-actions";
import { PortalNav } from "@/components/PortalNav";

const links = [
  { href: "/team", label: "Übersicht" },
  { href: "/team/teilnehmende", label: "Teilnehmende" },
  { href: "/team/kalender", label: "Kalender" },
  { href: "/team/nachrichten", label: "Nachrichten" },
  { href: "/team/material", label: "Material" },
  { href: "/team/betreuende", label: "Betreuende" },
];

export default async function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const staff = await requireStaff();

  return (
    <div className="min-h-screen bg-stone-50">
      <PortalNav
        title="Team-Bereich"
        subtitle={`Angemeldet als ${staff.name}`}
        links={links}
        logoutAction={logoutStaffAction}
      />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
