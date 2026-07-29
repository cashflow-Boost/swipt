/** Les modules de l'application (SPEC §4). L'ordre est celui de la navigation. */
export const NAV = [
  { href: "/tableau-de-bord", label: "Tableau de bord", icon: "dashboard" },
  { href: "/appels", label: "Journal des appels", icon: "phone" },
  { href: "/agenda", label: "Agenda", icon: "calendar" },
  { href: "/devis", label: "Devis", icon: "file" },
  { href: "/factures", label: "Factures", icon: "receipt" },
  { href: "/relances", label: "Relances", icon: "bell" },
  { href: "/clients", label: "Clients", icon: "users" },
  { href: "/mes-tarifs", label: "Mes tarifs", icon: "euro" },
  { href: "/reglages", label: "Réglages de l'agent", icon: "settings" },
] as const;

export type NavIcon = (typeof NAV)[number]["icon"];
