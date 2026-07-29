import Link from "next/link";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { LogoutButton } from "@/components/LogoutButton";
import { TakeControlButton } from "@/components/TakeControlButton";
import { Logo } from "@/components/Logo";
import { Splash } from "@/components/ui";
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
      <Splash />
      <header className="sticky top-0 z-50 flex items-center justify-between gap-4 border-b border-line bg-w px-5 py-3">
        <Logo href="/tableau-de-bord" />
        <div className="flex items-center gap-3">
          {session.orgName && (
            <span className="hidden text-[13px] font-medium text-soft sm:inline">
              {session.orgName}
            </span>
          )}
          <Link
            href="/abonnement"
            className="rounded-pill bg-or px-3.5 py-1.5 text-[12.5px] font-semibold text-ink"
          >
            S&apos;abonner
          </Link>
          <TakeControlButton paused={session.agentPaused} />
          <LogoutButton />
        </div>
      </header>

      {session.agentPaused && (
        <div className="border-b border-rd/30 bg-rd/10 px-5 py-2 text-center text-[13px] font-medium text-rd">
          Vous répondez vous-même — AlloChantier est en pause. Cliquez « Rendre la main à AlloChantier » pour réactiver la prise d&apos;appels.
        </div>
      )}

      {!session.accessOpen ? (
        <div className="border-b border-rd/30 bg-rd/10 px-5 py-2 text-center text-[13px] font-medium text-rd">
          Votre essai est terminé. Choisissez une offre pour qu&apos;AlloChantier reprenne vos appels.
        </div>
      ) : session.trialDaysLeft !== null && session.trialDaysLeft <= 3 ? (
        <div className="border-b border-or-line bg-or-wash px-5 py-2 text-center text-[13px] font-medium text-or-t">
          Essai : {session.trialDaysLeft} jour{session.trialDaysLeft > 1 ? "s" : ""} restant
          {session.trialDaysLeft > 1 ? "s" : ""}.{" "}
          <Link href="/abonnement" className="underline">
            Choisir une offre
          </Link>
        </div>
      ) : null}

      <div className="mx-auto flex max-w-[1400px] gap-6 px-5 py-6">
        <aside className="hidden w-56 shrink-0 md:block">
          <Sidebar />
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
