import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/AppShell";
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
    <div className="min-h-screen bg-[#F8FAFC]">
      <Splash />
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between gap-4 border-b border-slate-100 bg-white px-5">
        <Logo href="/tableau-de-bord" />
        <div className="flex items-center gap-4">
          {session.orgName && (
            <span className="hidden text-[13px] font-medium text-slate-500 sm:inline">
              {session.orgName}
            </span>
          )}
          <TakeControlButton paused={session.agentPaused} />
          <Link
            href="/abonnement"
            className="hidden text-[13px] font-medium text-slate-500 transition-colors hover:text-slate-900 sm:inline"
          >
            Mon abonnement
          </Link>
          <LogoutButton />
        </div>
      </header>

      {session.agentPaused && (
        <div className="bg-amber-50 px-5 py-2 text-center text-[13px] font-medium text-amber-700">
          Vous répondez vous-même — Lia est en pause. Réactivez-la avec l&apos;interrupteur en haut à droite.
        </div>
      )}

      {!session.accessOpen ? (
        <div className="bg-red-50 px-5 py-2 text-center text-[13px] font-medium text-red-700">
          Votre essai est terminé.{" "}
          <Link href="/abonnement" className="underline">Choisissez une offre</Link> pour que Lia
          reprenne vos appels.
        </div>
      ) : session.trialDaysLeft !== null && session.trialDaysLeft <= 3 ? (
        <div className="bg-blue-50 px-5 py-2 text-center text-[13px] font-medium text-blue-700">
          Essai : {session.trialDaysLeft} jour{session.trialDaysLeft > 1 ? "s" : ""} restant
          {session.trialDaysLeft > 1 ? "s" : ""}.{" "}
          <Link href="/abonnement" className="underline">Choisir une offre</Link>
        </div>
      ) : null}

      <AppShell>{children}</AppShell>
    </div>
  );
}
