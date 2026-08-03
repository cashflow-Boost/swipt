import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

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
  metadataBase: new URL("https://rimova.fr"),
  title: {
    default: "Rimova — L'assistante qui décroche quand vous ne pouvez pas",
    template: "%s — Rimova",
  },
  description:
    "Rimova répond à votre place, fixe vos rendez-vous, prépare vos devis et relance vos impayés. 7 appels gratuits, sans carte bancaire.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Rimova",
    title: "Rimova — L'assistante qui décroche quand vous ne pouvez pas",
    description:
      "La secrétaire téléphonique intelligente des artisans. Elle décroche, organise et facture pendant que vous travaillez.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
