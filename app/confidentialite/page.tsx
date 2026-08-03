import type { Metadata } from "next";
import { LegalDoc, LSection } from "@/components/LegalDoc";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Rimova",
  description: "Comment Rimova collecte, utilise et protège les données personnelles, conformément au RGPD.",
};

export default function ConfidentialitePage() {
  return (
    <LegalDoc title="Politique de confidentialité" updated="25 juillet 2026">
      <p>
        Cette politique explique quelles données Rimova traite, pourquoi, et quels sont vos droits, conformément
        au Règlement général sur la protection des données (RGPD) et à la loi Informatique et Libertés.
      </p>

      <LSection n="1." title="Responsable du traitement">
        <p>
          Le responsable du traitement est <b className="text-ink">[Raison sociale]</b>, dont les coordonnées
          figurent dans les <a href="/mentions-legales" className="text-or-t underline">mentions légales</a>.
          Pour toute question relative à vos données : <b className="text-ink">[adresse e-mail de contact]</b>.
        </p>
      </LSection>

      <LSection n="2." title="Données collectées">
        <ul className="ml-4 list-disc space-y-1">
          <li><b className="text-ink">Compte</b> : e-mail, nom de l&apos;entreprise, mot de passe (chiffré).</li>
          <li><b className="text-ink">Réglages professionnels</b> : métier, zone d&apos;intervention, horaires, tarifs.</li>
          <li><b className="text-ink">Appels traités par l&apos;agent</b> : numéro de l&apos;appelant, enregistrement et transcription de l&apos;échange, résumé du besoin.</li>
          <li><b className="text-ink">Clients &amp; interventions</b> : nom, téléphone, adresse, rendez-vous, devis, factures.</li>
          <li><b className="text-ink">Paiement</b> : les transactions d&apos;abonnement sont gérées par Stripe ; nous ne stockons aucune donnée de carte bancaire.</li>
          <li><b className="text-ink">Usage technique</b> : journaux de connexion nécessaires à la sécurité et au bon fonctionnement.</li>
        </ul>
      </LSection>

      <LSection n="3." title="Finalités et bases légales">
        <ul className="ml-4 list-disc space-y-1">
          <li>Fournir le service (répondre aux appels, poser des rendez-vous, établir devis et factures) — <b className="text-ink">exécution du contrat</b>.</li>
          <li>Facturer l&apos;abonnement et respecter les obligations comptables — <b className="text-ink">obligation légale</b>.</li>
          <li>Sécuriser et améliorer le service — <b className="text-ink">intérêt légitime</b>.</li>
        </ul>
        <p>
          <b className="text-ink">Enregistrement des appels :</b> l&apos;appelant est informé au décroché qu&apos;il
          s&apos;adresse à un assistant automatique. L&apos;enregistrement sert à établir la fiche d&apos;intervention
          et à permettre la correction par l&apos;artisan.
        </p>
      </LSection>

      <LSection n="4." title="Sous-traitants et destinataires">
        <p>Les données sont partagées uniquement avec les prestataires strictement nécessaires au service :</p>
        <ul className="ml-4 list-disc space-y-1">
          <li><b className="text-ink">Supabase</b> — hébergement de la base de données (Union européenne).</li>
          <li><b className="text-ink">Vercel</b> — hébergement de l&apos;application.</li>
          <li><b className="text-ink">Twilio</b> — acheminement téléphonique et vocal.</li>
          <li><b className="text-ink">Stripe</b> — traitement des paiements d&apos;abonnement.</li>
        </ul>
        <p>Aucune donnée n&apos;est vendue à des tiers.</p>
      </LSection>

      <LSection n="5." title="Durée de conservation">
        <p>
          Les données de compte sont conservées tant que le compte est actif, puis supprimées dans un délai
          raisonnable après résiliation. Les factures sont conservées 10 ans conformément aux obligations
          comptables. Les enregistrements d&apos;appels sont conservés le temps nécessaire à la gestion de
          l&apos;intervention, sauf durée plus courte que vous définissez.
        </p>
      </LSection>

      <LSection n="6." title="Vos droits">
        <p>
          Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de limitation, de
          portabilité et d&apos;opposition. Pour les exercer, écrivez à <b className="text-ink">[adresse e-mail de contact]</b>.
          Vous pouvez également introduire une réclamation auprès de la <b className="text-ink">CNIL</b> (www.cnil.fr).
        </p>
      </LSection>

      <LSection n="7." title="Cookies">
        <p>
          Rimova n&apos;utilise que les cookies strictement nécessaires à votre connexion et à la sécurité. Aucun
          cookie publicitaire ou de traçage tiers n&apos;est déposé sans votre consentement.
        </p>
      </LSection>
    </LegalDoc>
  );
}
