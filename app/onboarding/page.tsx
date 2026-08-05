"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LogoMark } from "@/components/Logo";

/** Vidéo de démo facultative : renseignez NEXT_PUBLIC_ONBOARDING_VIDEO_URL dans Vercel. */
const VIDEO_URL = process.env.NEXT_PUBLIC_ONBOARDING_VIDEO_URL;

const STEPS = ["Bienvenue", "Entreprise", "Téléphone", "Zone", "Horaires", "Urgences"] as const;

const DAYS = [
  { k: "mon", l: "Lun" }, { k: "tue", l: "Mar" }, { k: "wed", l: "Mer" },
  { k: "thu", l: "Jeu" }, { k: "fri", l: "Ven" }, { k: "sat", l: "Sam" }, { k: "sun", l: "Dim" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [orgName, setOrgName] = useState("");
  const [trade, setTrade] = useState("");
  const [phone, setPhone] = useState("");
  const [zone, setZone] = useState("");
  const [radius, setRadius] = useState("20");
  const [openDays, setOpenDays] = useState<string[]>(["mon", "tue", "wed", "thu", "fri"]);
  const [mFrom, setMFrom] = useState("08:00");
  const [mTo, setMTo] = useState("12:00");
  const [aFrom, setAFrom] = useState("13:30");
  const [aTo, setATo] = useState("18:00");
  const [urgent, setUrgent] = useState("Fuite active · Odeur de gaz · Panne totale de courant");
  const [callout, setCallout] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function toggleDay(k: string) {
    setOpenDays((d) => (d.includes(k) ? d.filter((x) => x !== k) : [...d, k]));
  }

  // Sécurité : un compte DÉJÀ configuré ne doit jamais revoir l'onboarding.
  // On file droit au tableau de bord (et vers /login si la session a expiré).
  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.assign("/login");
        return;
      }
      const { data } = await supabase
        .from("users")
        .select("org_id")
        .eq("id", user.id)
        .maybeSingle();
      if (data?.org_id) window.location.assign("/tableau-de-bord");
    })();
  }, []);

  const canNext =
    step === 0 ? true : step === 1 ? orgName.trim().length > 1 : true;

  async function finish() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data: orgId, error: e1 } = await supabase.rpc("onboard", {
      p_org_name: orgName,
      p_trade: trade || null,
    });
    if (e1) {
      setError(e1.message);
      setLoading(false);
      return;
    }
    // Horaires : un même créneau matin/après-midi appliqué aux jours cochés.
    const slots: [string, string][] = [];
    if (mFrom < mTo) slots.push([mFrom, mTo]);
    if (aFrom && aTo && aFrom < aTo) slots.push([aFrom, aTo]);
    const hours: Record<string, [string, string][]> = {};
    if (slots.length > 0) for (const d of openDays) hours[d] = slots;

    const euros = Number(callout.replace(",", "."));

    // Complète les réglages recueillis pendant le parcours.
    const { error: e2 } = await supabase
      .from("agent_settings")
      .update({
        business_phone: phone.trim() || null,
        zone_center: zone.trim() || null,
        zone_radius_km: radius ? Number(radius) : null,
        business_hours: Object.keys(hours).length > 0 ? hours : null,
        urgent_triggers: urgent
          .split(/[·,;]/).map((s) => s.trim()).filter(Boolean),
        callout_fee_cents: Number.isFinite(euros) && euros > 0 ? Math.round(euros * 100) : null,
      })
      .eq("org_id", orgId as string);
    if (e2) {
      setError(e2.message);
      setLoading(false);
      return;
    }
    window.location.assign("/tableau-de-bord");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-w2 px-6 py-10">
      <div className="w-full max-w-md">
        {/* En-tête marque */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <LogoMark size={28} />
          <span className="text-[20px] font-bold tracking-tight text-nv">Rimova</span>
        </div>

        {/* Progression */}
        <div className="mb-5 flex items-center justify-center gap-1.5">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? "w-7 bg-or" : i < step ? "w-4 bg-or/50" : "w-4 bg-line2"
              }`}
            />
          ))}
        </div>

        <div className="rounded-[16px] border border-line bg-w p-6 shadow-sh2">
          {/* ── Étape 0 : Bienvenue ── */}
          {step === 0 && (
            <div className="text-center">
              <h1 className="text-[22px] font-bold tracking-tight text-nv">Bienvenue chez Rimova 🎧</h1>
              <p className="mx-auto mt-2 max-w-[34ch] text-[14.5px] leading-relaxed text-soft">
                En 4 étapes, on configure votre standard. Ensuite, Sonia décroche à votre place —
                même quand vous êtes sur un chantier.
              </p>

              {VIDEO_URL ? (
                <div className="mt-5 overflow-hidden rounded-xl border border-line">
                  <video src={VIDEO_URL} controls className="aspect-video w-full bg-nv" />
                </div>
              ) : (
                <div className="mt-5 rounded-xl bg-nv-wash px-4 py-5 text-[13px] text-soft">
                  <div className="flex justify-center gap-6 text-[12px] font-medium text-nv-2">
                    <span>1 · Elle décroche</span>
                    <span>2 · Elle qualifie</span>
                    <span>3 · Elle pose le RDV</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Étape 1 : Entreprise ── */}
          {step === 1 && (
            <div>
              <h1 className="text-lg font-[650] text-nv">Votre entreprise</h1>
              <p className="mb-5 mt-1 text-[13.5px] text-soft">Le nom que Sonia annoncera au décroché.</p>
              <Field label="Nom de l'entreprise" value={orgName} onChange={setOrgName} placeholder="Plomberie Vasseur" autoFocus />
              <Field label="Métier" value={trade} onChange={setTrade} placeholder="Plomberie et chauffage" />
            </div>
          )}

          {/* ── Étape 2 : Téléphone ── */}
          {step === 2 && (
            <div>
              <h1 className="text-lg font-[650] text-nv">Votre numéro</h1>
              <p className="mb-5 mt-1 text-[13.5px] text-soft">
                Celui sur lequel vous répondez d&apos;habitude à vos clients.
              </p>
              <Field label="Votre numéro professionnel" value={phone} onChange={setPhone} placeholder="06 12 34 56 78" type="tel" autoFocus />
              <p className="mt-2 rounded-lg bg-nv-wash px-3 py-2.5 text-[12.5px] leading-relaxed text-soft">
                Vous gardez votre numéro, vous n&apos;en changez pas. C&apos;est aussi sur celui-ci
                que Sonia vous transfère les urgences.
              </p>
            </div>
          )}

          {/* ── Étape 3 : Zone ── */}
          {step === 3 && (
            <div>
              <h1 className="text-lg font-[650] text-nv">Votre zone d&apos;intervention</h1>
              <p className="mb-5 mt-1 text-[13.5px] text-soft">
                Sonia refuse poliment les chantiers hors de votre secteur.
              </p>
              <Field label="Ville de référence" value={zone} onChange={setZone} placeholder="Poissy" autoFocus />
              <Field label="Rayon (km)" value={radius} onChange={setRadius} placeholder="20" type="number" />
              <p className="mt-2 text-[12.5px] text-soft">
                Vous pourrez tout affiner plus tard dans « Réglages ».
              </p>
            </div>
          )}

          {/* ── Étape 4 : Horaires ── */}
          {step === 4 && (
            <div>
              <h1 className="text-lg font-[650] text-nv">Vos horaires</h1>
              <p className="mb-4 mt-1 text-[13.5px] text-soft">
                Sonia ne posera jamais de rendez-vous en dehors de ces créneaux.
              </p>
              <div className="mb-4 flex flex-wrap gap-1.5">
                {DAYS.map((d) => (
                  <button
                    key={d.k}
                    type="button"
                    onClick={() => toggleDay(d.k)}
                    className={`rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
                      openDays.includes(d.k) ? "bg-or text-w" : "bg-w2 text-soft border border-line2"
                    }`}
                  >
                    {d.l}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Matin — début" value={mFrom} onChange={setMFrom} type="time" />
                <Field label="Matin — fin" value={mTo} onChange={setMTo} type="time" />
                <Field label="Après-midi — début" value={aFrom} onChange={setAFrom} type="time" />
                <Field label="Après-midi — fin" value={aTo} onChange={setATo} type="time" />
              </div>
            </div>
          )}

          {/* ── Étape 5 : Urgences ── */}
          {step === 5 && (
            <div>
              <h1 className="text-lg font-[650] text-nv">Urgences et déplacement</h1>
              <p className="mb-5 mt-1 text-[13.5px] text-soft">
                Ce qui doit vous être transféré immédiatement, sans attendre.
              </p>
              <Field
                label="Urgences à vous transférer"
                value={urgent}
                onChange={setUrgent}
                placeholder="Fuite active · Odeur de gaz · Personne bloquée"
                autoFocus
              />
              <p className="-mt-2 mb-4 text-[12px] text-faint">Séparez par «&nbsp;·&nbsp;» ou une virgule.</p>
              <Field
                label="Forfait déplacement (€ TTC, facultatif)"
                value={callout}
                onChange={setCallout}
                placeholder="45"
                type="number"
              />
              <p className="text-[12.5px] text-soft">
                Sonia l&apos;annoncera si un client demande le prix du déplacement. Laissez vide si
                vous préférez ne rien annoncer.
              </p>
            </div>
          )}

          {error && (
            <p className="mt-4 rounded-sm border border-[#F2D5D2] bg-rd-wash px-3 py-2 text-[13px] text-rd">{error}</p>
          )}

          {/* Navigation */}
          <div className="mt-6 flex items-center gap-3">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="rounded-pill px-4 py-2.5 text-[14px] font-medium text-soft hover:text-nv"
              >
                Retour
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                disabled={!canNext}
                onClick={() => setStep((s) => s + 1)}
                className="ml-auto rounded-pill bg-or px-6 py-2.5 text-[14.5px] font-semibold text-w disabled:opacity-50"
              >
                Continuer
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={finish}
                className="ml-auto rounded-pill bg-or px-6 py-2.5 text-[14.5px] font-semibold text-w disabled:opacity-60"
              >
                {loading ? "Création…" : "Créer mon standard"}
              </button>
            )}
          </div>
        </div>

        {step === 0 && (
          <p className="mt-4 text-center text-[12.5px] text-faint">
            Vos 7 premiers appels sont offerts, sans carte bancaire.
          </p>
        )}
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoFocus,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoFocus?: boolean;
}) {
  return (
    <label className="mb-4 block">
      <span className="mb-1 block text-[13px] font-medium text-soft">{label}</span>
      <input
        type={type}
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-sm border border-line2 bg-w px-3 py-2.5 text-[15px] outline-none focus-visible:border-or"
      />
    </label>
  );
}
