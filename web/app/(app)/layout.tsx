import Link from "next/link";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { LogoutButton } from "@/components/LogoutButton";
import { getUserAndOrg } from "@/lib/auth";

/**
 * Coquille de l'application authentifiée (SPEC §4). Redirige vers /login sans
 * session. L'en-tête porte en permanence le bouton « Je reprends la main »
 * (SPEC §4.9) : sa présence visible est ce qui rend l'artisan prêt à confier
 * ses appels.
 */
export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getUserAndOrg();
  if (!session) redirect("/login");
  if (!session.orgId) redirect("/onboarding");

  return (
    <div className="min-h-screen bg-w2">
      <header className="sticky top-0 z-50 flex items-center justify-between gap-4 border-b border-line bg-w px-5 py-3">
        <Link href="/tableau-de-bord" className="flex items-center gap-2 text-[19px] font-bold tracking-tight">
          <span>SWIPT</span>
          <span className="flex gap-0.5">
            <i className="block h-3.5 w-[7px] bg-or [clip-path:polygon(0_0,52%_0,100%_50%,52%_100%,0_100%,48%_50%)]" />
            <i className="block h-3.5 w-[7px] bg-or [clip-path:polygon(0_0,52%_0,100%_50%,52%_100%,0_100%,48%_50%)]" />
          </span>
        </Link>
        <div className="flex items-center gap-3">
          {session.orgName && (
            <span className="hidden text-[13px] font-medium text-soft sm:inline">
              {session.orgName}
            </span>
          )}
          <button
            type="button"
            className="rounded-pill border border-line2 bg-w px-3.5 py-1.5 text-[12.5px] font-semibold text-rd"
          >
            ⏸ Je reprends la main
          </button>
          <LogoutButton />
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-6 px-5 py-6">
        <aside className="hidden w-56 shrink-0 md:block">
          <Sidebar />
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
