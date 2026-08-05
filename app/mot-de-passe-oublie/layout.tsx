import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mot de passe oublié",
  description: "Recevez un lien pour réinitialiser le mot de passe de votre compte Rimova.",
};

export default function ForgotLayout({ children }: { children: React.ReactNode }) {
  return children;
}
