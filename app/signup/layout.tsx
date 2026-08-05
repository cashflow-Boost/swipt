import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Créer un compte",
  description: "Créez votre compte Rimova : vos 7 premiers appels sont offerts, sans carte bancaire.",
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
