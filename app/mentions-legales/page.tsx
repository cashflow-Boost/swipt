import type { Metadata } from "next";
import { LegalDoc, LSection } from "@/components/LegalDoc";

export const metadata: Metadata = {
  title: "Mentions légales — Rimova",
  description: "Mentions légales du service Rimova, standard téléphonique intelligent des artisans du dépannage.",
};

export default function MentionsLegalesPage() {
  return (
    <LegalDoc title="Mentions légales" updated="25 juillet 2026">
      <LSection n="1." title="Éditeur du site">
        <p>Le site et le service Rimova sont édités par :</p>
        <ul className="ml-4 list-disc space-y-1">
          <li>Raison sociale : <b className="text-ink">[Raison sociale]</b></li>
          <li>Forme juridique : <b className="text-ink">[SAS / SASU / EURL / auto-entrepreneur…]</b></li>
          <li>Capital social : <b className="text-ink">[montant] €</b></li>
          <li>Siège social : <b className="text-ink">[Adresse complète du siège]</b></li>
          <li>SIRET : <b className="text-ink">[numéro SIRET]</b></li>
          <li>RCS / RM : <b className="text-ink">[ville et numéro d&apos;immatriculation]</b></li>
          <li>N° de TVA intracommunautaire : <b className="text-ink">[FR…]</b></li>
          <li>Directeur de la publication : <b className="text-ink">[Nom et prénom]</b></li>
          <li>Contact : <b className="text-ink">[adresse e-mail de contact]</b></li>
        </ul>
      </LSection>

      <LSection n="2." title="Hébergement">
        <p>
          L&apos;application est hébergée par <b className="text-ink">Vercel Inc.</b>, 340 S Lemon Ave #4133,
          Walnut, CA 91789, États-Unis.
        </p>
        <p>
          Les données (comptes, appels, devis, factures) sont stockées par <b className="text-ink">Supabase</b>{" "}
          sur une infrastructure située dans l&apos;Union européenne (région Europe de l&apos;Ouest, Irlande).
        </p>
      </LSection>

      <LSection n="3." title="Propriété intellectuelle">
        <p>
          L&apos;ensemble des éléments du site (marque « Rimova », logo, textes, interface, code) est protégé par
          le droit de la propriété intellectuelle et reste la propriété exclusive de l&apos;éditeur. Toute
          reproduction ou représentation, totale ou partielle, sans autorisation écrite, est interdite.
        </p>
      </LSection>

      <LSection n="4." title="Données personnelles">
        <p>
          Le traitement des données personnelles est décrit dans notre{" "}
          <a href="/confidentialite" className="text-or-t underline">politique de confidentialité</a>. Vous y
          trouverez notamment les modalités d&apos;exercice de vos droits (accès, rectification, effacement).
        </p>
      </LSection>

      <LSection n="5." title="Responsabilité">
        <p>
          L&apos;éditeur s&apos;efforce d&apos;assurer l&apos;exactitude des informations diffusées et la
          disponibilité du service, sans pouvoir garantir une absence totale d&apos;interruption. Les liens vers
          des sites tiers n&apos;engagent pas la responsabilité de l&apos;éditeur quant à leur contenu.
        </p>
      </LSection>
    </LegalDoc>
  );
}
