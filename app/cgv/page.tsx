import type { Metadata } from "next";
import { LegalDoc, LSection } from "@/components/LegalDoc";

export const metadata: Metadata = {
  title: "Conditions générales de vente — SWIPT",
  description: "Conditions générales de vente et d'utilisation du service d'abonnement SWIPT.",
};

export default function CgvPage() {
  return (
    <LegalDoc title="Conditions générales de vente" updated="25 juillet 2026">
      <LSection n="1." title="Objet">
        <p>
          Les présentes conditions régissent l&apos;abonnement au service SWIPT, un standard téléphonique
          automatisé destiné aux artisans : il répond aux appels, pose des rendez-vous, prépare devis et
          factures et relance les impayés. L&apos;abonnement vaut acceptation des présentes conditions.
        </p>
      </LSection>

      <LSection n="2." title="Offres et tarifs">
        <p>Le service est proposé en trois offres, hors taxes, par mois :</p>
        <ul className="ml-4 list-disc space-y-1">
          <li><b className="text-ink">Solo</b> — 149 € HT / mois — 130 appels traités inclus.</li>
          <li><b className="text-ink">Équipe</b> — 299 € HT / mois — 260 appels traités inclus.</li>
          <li><b className="text-ink">Pro</b> — 549 € HT / mois — 480 appels traités inclus.</li>
        </ul>
        <p>
          Au-delà du volume inclus, chaque appel traité supplémentaire est facturé <b className="text-ink">0,79 € HT</b>,
          le mois suivant. Les prix s&apos;entendent hors TVA applicable.
        </p>
      </LSection>

      <LSection n="3." title="Période d'essai">
        <p>
          L&apos;abonnement débute par une période d&apos;essai gratuite de <b className="text-ink">7 jours</b>, sans
          carte bancaire et sans engagement. À l&apos;issue de l&apos;essai, l&apos;accès au service se poursuit
          uniquement après souscription d&apos;une offre payante.
        </p>
      </LSection>

      <LSection n="4." title="Paiement">
        <p>
          Le paiement de l&apos;abonnement s&apos;effectue par <b className="text-ink">PayPal</b>, mensuellement et
          d&apos;avance. En cas de défaut de paiement, l&apos;accès au service peut être suspendu après information
          de l&apos;abonné.
        </p>
      </LSection>

      <LSection n="5." title="Durée et résiliation">
        <p>
          L&apos;abonnement est <b className="text-ink">sans engagement de durée</b> et résiliable à tout moment
          depuis l&apos;espace client, avec effet à la fin de la période mensuelle en cours. Aucune reconduction ne
          survit à la résiliation. Vos données restent accessibles jusqu&apos;au terme de la période payée.
        </p>
      </LSection>

      <LSection n="6." title="Obligations de l'abonné">
        <p>
          L&apos;abonné s&apos;engage à fournir des informations exactes (zone, horaires, tarifs), à disposer des
          autorisations nécessaires auprès de son opérateur pour le renvoi d&apos;appel, et à vérifier les devis et
          factures générés avant leur envoi à ses propres clients.
        </p>
      </LSection>

      <LSection n="7." title="Responsabilité">
        <p>
          SWIPT est un outil d&apos;assistance : la responsabilité finale des rendez-vous, devis et factures
          transmis aux clients de l&apos;abonné lui incombe. L&apos;éditeur met en œuvre les moyens raisonnables pour
          assurer la continuité du service mais ne peut être tenu responsable des interruptions imputables aux
          opérateurs téléphoniques ou aux prestataires tiers.
        </p>
      </LSection>

      <LSection n="8." title="Données personnelles">
        <p>
          Le traitement des données est décrit dans la{" "}
          <a href="/confidentialite" className="text-or-t underline">politique de confidentialité</a>, qui fait
          partie intégrante des présentes conditions.
        </p>
      </LSection>

      <LSection n="9." title="Droit applicable et litiges">
        <p>
          Les présentes conditions sont soumises au droit français. En cas de litige, une solution amiable sera
          recherchée en priorité. À défaut, un consommateur peut recourir gratuitement à un médiateur de la
          consommation avant toute action judiciaire. Les tribunaux compétents sont ceux du ressort du siège de
          l&apos;éditeur, sous réserve des règles impératives protégeant le consommateur.
        </p>
      </LSection>
    </LegalDoc>
  );
}
