import { LogoMark } from "@/components/Logo";

/**
 * Maquette de téléphone animée (100 % CSS, aucune image externe).
 * Elle joue en boucle la scène clé du produit : un appel entre, puis Lia
 * décroche, discute et pose le rendez-vous. Se fige sur l'écran « en ligne »
 * si l'utilisateur a désactivé les animations.
 */
export function HeroPhone() {
  return (
    <div className="relative mx-auto w-[270px] sm:w-[290px]">
      {/* Halo lumineux derrière le téléphone */}
      <div
        aria-hidden
        className="absolute -inset-10 -z-10 rounded-full opacity-70 blur-3xl"
        style={{ background: "radial-gradient(closest-side, #DBEAFE, transparent 75%)" }}
      />

      <div className="ac-float rounded-[46px] bg-nv p-2.5 shadow-[0_40px_80px_-30px_rgba(30,58,138,.55)]">
        <div className="relative h-[560px] overflow-hidden rounded-[38px] bg-gradient-to-b from-w to-w3">
          {/* Encoche */}
          <div className="absolute left-1/2 top-3 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-nv" />

          {/* ── Écran 1 : appel entrant ──────────────────────────────── */}
          <div className="ac-scene-incoming absolute inset-0 flex flex-col items-center px-6 pt-16 pb-8">
            <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-faint">Appel entrant</p>

            <div className="relative mt-16 flex h-32 w-32 items-center justify-center">
              <span className="ac-ring-wave absolute inset-0 rounded-full border-2 border-or-line" />
              <span className="ac-ring-wave absolute inset-0 rounded-full border-2 border-or-line" style={{ animationDelay: "1.2s" }} />
              <span className="flex h-24 w-24 items-center justify-center rounded-full bg-nv-wash">
                <LogoMark size={44} />
              </span>
            </div>

            <p className="mt-8 text-[22px] font-semibold tracking-tight text-nv">06 71 •• •• 42</p>
            <p className="mt-1 text-[14px] text-soft">Client · Poissy</p>

            <div className="mt-auto flex w-full items-center justify-between px-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-rd/90 shadow-lg">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M3 5c0 9 7 16 16 16l2-4-5-2-2 2a14 14 0 0 1-5-5l2-2-2-5z" transform="rotate(135 12 12)" />
                </svg>
              </span>
              <span className="ac-pulse flex h-16 w-16 items-center justify-center rounded-full bg-gr shadow-lg">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M3 5c0 9 7 16 16 16l2-4-5-2-2 2a14 14 0 0 1-5-5l2-2-2-5z" />
                </svg>
              </span>
            </div>
          </div>

          {/* ── Écran 2 : Lia en ligne, elle pose le RDV ─────────────── */}
          <div className="ac-scene-live absolute inset-0 flex flex-col px-5 pt-14 pb-6">
            <div className="flex items-center gap-2">
              <span className="ac-pulse h-2.5 w-2.5 rounded-full bg-gr" />
              <span className="text-[13px] font-semibold text-nv">En ligne · Gildra</span>
              <span className="ml-auto font-mono text-[12px] text-faint">00:12</span>
            </div>

            {/* Égaliseur — la voix de Lia */}
            <div className="mt-4 flex h-8 items-end justify-center gap-1">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <span
                  key={i}
                  className="ac-eq-bar w-1.5 rounded-full bg-or"
                  style={{ height: "100%", animationDelay: `${i * 0.12}s` }}
                />
              ))}
            </div>

            {/* Transcription */}
            <div className="mt-5 flex flex-col gap-2.5">
              <div className="ac-bubble max-w-[85%] self-start rounded-2xl rounded-tl-md bg-nv px-3.5 py-2.5 text-[12.5px] leading-snug text-w" style={{ animationDelay: ".1s" }}>
                Plomberie Vasseur, bonjour ! Que puis-je faire pour vous ?
              </div>
              <div className="ac-bubble max-w-[85%] self-end rounded-2xl rounded-tr-md bg-line2/60 px-3.5 py-2.5 text-[12.5px] leading-snug text-nv" style={{ animationDelay: ".9s" }}>
                J&apos;ai une fuite sous l&apos;évier, c&apos;est urgent…
              </div>
              <div className="ac-bubble max-w-[88%] self-start rounded-2xl rounded-tl-md bg-nv px-3.5 py-2.5 text-[12.5px] leading-snug text-w" style={{ animationDelay: "1.7s" }}>
                Je vous cale un créneau demain à neuf heures. C&apos;est noté !
              </div>
            </div>

            {/* Confirmation du rendez-vous */}
            <div className="ac-bubble mt-auto flex items-center gap-2.5 rounded-2xl border border-or-line bg-or-wash px-3.5 py-3" style={{ animationDelay: "2.4s" }}>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gr">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              <div className="leading-tight">
                <p className="text-[12.5px] font-semibold text-or-t">Rendez-vous posé</p>
                <p className="text-[11.5px] text-soft">Demain · 9 h 00 · Fuite évier</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
