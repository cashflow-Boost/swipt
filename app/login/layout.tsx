import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Accédez à votre standard Rimova.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
