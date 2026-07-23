const ROWS: { k: string; v: string; h: string }[] = [
  { k: "Nom annoncé", v: "« Plomberie Vasseur, bonsoir »", h: "Suivi de la mention d'accueil automatique" },
  { k: "Métier", v: "Plomberie et chauffage", h: "Détermine le questionnement et le vocabulaire" },
  { k: "Zone d'intervention", v: "Poissy et 15 km alentour", h: "Au-delà, SWIPT refuse poliment et l'indique à l'appelant" },
  { k: "Horaires de rendez-vous", v: "Lun–ven 8 h – 18 h, sam 9 h – 12 h", h: "SWIPT ne propose rien en dehors" },
  { k: "Déclenchement", v: "Après 4 sonneries sans réponse", h: "Votre téléphone sonne toujours en premier" },
  { k: "Forfait de déplacement", v: "45 € TTC", h: "Annoncé systématiquement pendant l'appel" },
  { k: "Bibliothèque de prix", v: "218 ouvrages renseignés", h: "Base du chiffrage automatique des devis" },
  { k: "Urgences à transférer", v: "Fuite active · coupure totale · personne bloquée · odeur de gaz", h: "Alerte immédiate au lieu du résumé du soir" },
  { k: "Ce que SWIPT refuse", v: "Démarchage · hors zone · hors métier · négociation de prix", h: "Vous ajoutez vos propres règles quand vous voulez" },
];

export default function ReglagesPage() {
  return (
    <div>
      <div className="mb-5 border-b border-line pb-4">
        <h1 className="text-xl font-[650]">Réglages de l&apos;agent</h1>
        <p className="mt-1 text-sm text-soft">
          Ce qui transforme un service générique en votre standard à vous.
        </p>
      </div>

      <div className="overflow-hidden rounded-[11px] border border-line">
        {ROWS.map((r) => (
          <div
            key={r.k}
            className="grid gap-1 border-b border-line px-4 py-3.5 last:border-b-0 sm:grid-cols-[210px_1fr] sm:items-baseline sm:gap-5"
          >
            <div className="text-[13.5px] text-soft">{r.k}</div>
            <div>
              <div className="text-[14.5px] font-medium">{r.v}</div>
              <div className="mt-0.5 text-[12.5px] text-soft">{r.h}</div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-[13px] text-soft">
        Écran de référence. Les valeurs proviendront de{" "}
        <code className="font-mono text-faint">getAgentSettings</code> et seront
        modifiées via{" "}
        <code className="font-mono text-faint">updateAgentSettings</code>{" "}
        (<code className="font-mono text-faint">lib/actions/agent-settings.ts</code>)
        une fois Supabase connecté.
      </p>
    </div>
  );
}
