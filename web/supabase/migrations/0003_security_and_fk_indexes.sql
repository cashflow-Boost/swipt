-- Sécurité : retirer l'exposition RPC aux rôles non authentifiés.
-- Le grant EXECUTE implicite à PUBLIC rendait ces fonctions SECURITY DEFINER
-- appelables par le rôle anon via /rest/v1/rpc. On restreint à authenticated
-- (nécessaire à l'évaluation des politiques RLS et à l'onboarding).
revoke execute on function public.current_org_id() from public;
revoke execute on function public.current_org_id() from anon;
grant execute on function public.current_org_id() to authenticated;

revoke execute on function public.onboard(text, text) from public;
revoke execute on function public.onboard(text, text) from anon;
grant execute on function public.onboard(text, text) to authenticated;

-- Performance : index de couverture sur les clés étrangères non indexées
-- (améliore jointures et suppressions en cascade).
create index if not exists appointments_call_id_idx     on public.appointments (call_id);
create index if not exists appointments_customer_id_idx on public.appointments (customer_id);
create index if not exists calls_corrected_by_idx        on public.calls (corrected_by);
create index if not exists calls_customer_id_idx         on public.calls (customer_id);
create index if not exists invoices_quote_id_idx         on public.invoices (quote_id);
create index if not exists quotes_call_id_idx            on public.quotes (call_id);
create index if not exists quotes_customer_id_idx        on public.quotes (customer_id);
