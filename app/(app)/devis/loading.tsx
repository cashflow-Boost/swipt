import { SkeletonList } from "@/components/ui";

/** Squelette affiché pendant le chargement de la liste des devis. */
export default function Loading() {
  return (
    <div>
      <div className="mb-5 border-b border-line pb-4">
        <span className="ac-skeleton block h-5 w-40 rounded" />
        <span className="ac-skeleton mt-2 block h-3 w-72 rounded" />
      </div>
      <SkeletonList rows={5} />
    </div>
  );
}
