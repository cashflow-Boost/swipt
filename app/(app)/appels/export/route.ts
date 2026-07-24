import { getSessionOrg } from "@/lib/auth";
import { getCalls } from "@/lib/data";

// Export CSV du journal des appels (SPEC §4.1). Séparateur ';' + BOM pour
// une ouverture correcte dans Excel FR (accents).
function cell(v: string): string {
  const s = v ?? "";
  return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET() {
  const session = await getSessionOrg();
  if (!session) return new Response("Non authentifié", { status: 401 });

  const calls = await getCalls();
  const header = ["Heure", "Client", "Demande", "Statut"].join(";");
  const rows = calls.map((c) =>
    [c.time, c.customer, c.request, c.statusLabel].map(cell).join(";"),
  );
  const csv = "﻿" + [header, ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="appels-swipt.csv"',
    },
  });
}
