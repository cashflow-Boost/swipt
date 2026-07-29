/**
 * Illustration du hero — ce que l'artisan voit sur son téléphone pendant qu'il
 * travaille : l'appel pris par Lia, puis le résumé. Dessin vectoriel maison :
 * pas de photo externe à charger, rien à licencier, et le rendu reste net sur
 * tous les écrans.
 */
export function HeroVisual() {
  return (
    <svg
      viewBox="0 0 420 300"
      className="h-auto w-full max-w-[420px]"
      role="img"
      aria-label="Un téléphone affichant un appel pris par AlloChantier et le résumé du rendez-vous"
    >
      {/* halo */}
      <ellipse cx="210" cy="268" rx="150" ry="16" fill="#1E3A5F" opacity=".07" />

      {/* ondes sonores */}
      <g stroke="#FF6B35" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity=".55">
        <path d="M330 108a44 44 0 0 1 0 62" />
        <path d="M348 90a70 70 0 0 1 0 98" />
      </g>
      <g stroke="#FF6B35" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity=".55">
        <path d="M90 108a44 44 0 0 0 0 62" />
        <path d="M72 90a70 70 0 0 0 0 98" />
      </g>

      {/* téléphone */}
      <rect x="128" y="22" width="164" height="248" rx="22" fill="#1E3A5F" />
      <rect x="136" y="30" width="148" height="232" rx="16" fill="#FFFFFF" />
      <rect x="188" y="38" width="44" height="6" rx="3" fill="#1E3A5F" opacity=".25" />

      {/* bandeau d'appel */}
      <rect x="146" y="56" width="128" height="52" rx="12" fill="#FFF3EE" />
      <circle cx="170" cy="82" r="14" fill="#FF6B35" />
      <path
        d="M165 77.5c-.6.6-.8 1.6-.4 2.4a13 13 0 0 0 6.9 6.9c.8.4 1.8.2 2.4-.4l1.4-1.4-2.6-2.6-1.6 1.1a9 9 0 0 1-3.2-3.2l1.1-1.6-2.6-2.6-1.4 1.4Z"
        fill="#FFFFFF"
      />
      <rect x="192" y="70" width="66" height="7" rx="3.5" fill="#1E3A5F" opacity=".85" />
      <rect x="192" y="83" width="44" height="6" rx="3" fill="#1E3A5F" opacity=".35" />

      {/* fiche résumée */}
      <rect x="146" y="120" width="128" height="60" rx="12" fill="#F1F5F9" />
      <rect x="158" y="132" width="52" height="6" rx="3" fill="#1E3A5F" opacity=".55" />
      <rect x="158" y="146" width="88" height="6" rx="3" fill="#1E3A5F" opacity=".28" />
      <rect x="158" y="160" width="70" height="6" rx="3" fill="#1E3A5F" opacity=".28" />

      {/* créneau confirmé */}
      <rect x="146" y="192" width="128" height="46" rx="12" fill="#EDF7F1" />
      <circle cx="168" cy="215" r="11" fill="#16794A" />
      <path d="m163.5 215 3.2 3.4 6-6.6" stroke="#FFFFFF" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="186" y="207" width="60" height="6" rx="3" fill="#16794A" opacity=".75" />
      <rect x="186" y="219" width="40" height="5" rx="2.5" fill="#16794A" opacity=".45" />

      {/* casque de chantier */}
      <g transform="translate(38 176)">
        <path d="M4 30a26 26 0 0 1 52 0Z" fill="#FF6B35" />
        <rect x="0" y="30" width="60" height="8" rx="4" fill="#E55A2B" />
        <path d="M22 6a26 26 0 0 1 16 0" stroke="#E55A2B" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>

      {/* clé plate */}
      <g transform="translate(330 186) rotate(24)">
        <path
          d="M14 4a13 13 0 0 0-9.6 21.8L0 30l6 6 4.2-4.4A13 13 0 1 0 14 4Zm0 6a7 7 0 1 1 0 14 7 7 0 0 1 0-14Z"
          fill="#1E3A5F"
          opacity=".55"
        />
        <rect x="22" y="26" width="30" height="8" rx="4" transform="rotate(45 22 26)" fill="#1E3A5F" opacity=".55" />
      </g>
    </svg>
  );
}
