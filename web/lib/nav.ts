/** Les huit modules de l'application (SPEC §4). L'ordre est celui de la navigation. */
export const NAV = [
  { href: "/tableau-de-bord", label: "Tableau de bord" },
  { href: "/appels", label: "Journal des appels", badge: "critique" },
  { href: "/agenda", label: "Agenda" },
  { href: "/devis", label: "Devis" },
  { href: "/factures", label: "Factures" },
  { href: "/relances", label: "Relances" },
  { href: "/clients", label: "Clients" },
  { href: "/reglages", label: "Réglages de l'agent" },
] as const;
