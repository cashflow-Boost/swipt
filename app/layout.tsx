import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { THEME_BOOT } from "@/components/Theme";

// Polices auto-hébergées au build (aucune requête runtime vers Google — SPEC §8, RGPD).
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://allochantier.com"),
  title: {
    default: "AlloChantier — L'assistante qui décroche quand vous ne pouvez pas",
    template: "%s — AlloChantier",
  },
  description:
    "AlloChantier répond à votre place, fixe vos rendez-vous, prépare vos devis et relance vos impayés. Essai gratuit 7 jours, sans carte bancaire.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "AlloChantier",
    title: "AlloChantier — L'assistante qui décroche quand vous ne pouvez pas",
    description:
      "La secrétaire téléphonique intelligente des artisans. Elle décroche, organise et facture pendant que vous travaillez.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Avant la première peinture : pas d'éclair blanc en thème sombre. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
