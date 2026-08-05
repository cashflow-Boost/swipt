import type { Metadata } from "next";
import { LegalDoc, LSection } from "@/components/LegalDoc";

export const metadata: Metadata = {
  title: "Mentions légales — Rimova",
  description: "Mentions légales du service Rimova, standard téléphonique intelligent des artisans du dépannage.",
};

/** Adresse de contact — à régler dans Vercel (NEXT_PUBLIC_SUPPORT_EMAIL). */
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "contact@rimova.fr";

export default function MentionsLegalesPage() {
  return (
    <LegalDoc title="Mentions légales" updated="25 juillet 2026">
      <LSection n="1." title="Éditeur du site">
        <p>
          Rimova est actuellement diffusé en <b className="text-ink">version bêta gratuite</b>. Le service
          est édité par un particulier, à titre non commercial : aucun paiement n&apos;est collecté et
          aucun abonnement n&apos;est commercialisé à ce stade.
        </p>
        <p>
          Pour toute question relative au site ou à vos données, écrivez à{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-or-t underline">{CONTACT_EMAIL}</a>.
        </p>
        <p>
          Les mentions d&apos;identification complètes (dénomination, forme juridique, siège, SIRET,
          TVA, directeur de la publication) seront publiées ici dès l&apos;immatriculation de la
          structure, préalablement à toute mise en service payante.
        </p>
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
