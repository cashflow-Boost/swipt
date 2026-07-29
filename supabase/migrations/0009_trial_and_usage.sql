-- SWIPT — fin de l'essai et comptage des appels.
--
-- 1) L'essai de 7 jours (SPEC §6) doit réellement se terminer : jusqu'ici
--    trial_ends_at n'était jamais posé ni vérifié, donc l'accès était gratuit
--    sans limite de temps.
-- 2) Le forfait inclut un volume d'appels puis facture le dépassement
--    (0,79 € HT / appel) : encore fallait-il compter les appels traités.

-- ── 1. Statut d'abonnement ───────────────────────────────────────────────────
alter table public.organizations
  add column if not exists subscription_status text not null default 'trialing'
    check (subscription_status in ('trialing','active','past_due','canceled'));

comment on column public.organizations.subscription_status is
  'trialing = essai en cours ; active = abonnement payé ; l''accès est ouvert si active, ou si trialing et trial_ends_at > now().';

-- Comptes existants (comptes de test) : essai long pour ne pas se verrouiller
-- pendant la mise au point. Les nouvelles inscriptions auront bien 7 jours.
update public.organizations
   set trial_ends_at = now() + interval '90 days'
 where trial_ends_at is null;

-- ── 2. onboard() pose la fin d'essai ─────────────────────────────────────────
create or replace function public.onboard(p_org_name text, p_trade text default null)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org uuid;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  select org_id into v_org from public.users where id = auth.uid();
  if v_org is not null then
    return v_org;
  end if;

  -- 7 jours d'essai à compter de l'inscription (SPEC §6).
  insert into public.organizations (name, trade, plan, plan_calls_included, trial_ends_at, subscription_status)
    values (p_org_name, p_trade, 'solo', 130, now() + interval '7 days', 'trialing')
    returning id into v_org;

  insert into public.users (id, org_id, email, role)
    values (auth.uid(), v_org, coalesce(auth.jwt() ->> 'email', ''), 'owner');

  insert into public.agent_settings (org_id, announced_name, trade)
    values (v_org, p_org_name, p_trade);

  return v_org;
end;
$$;

revoke execute on function public.onboard(text, text) from anon;
grant execute on function public.onboard(text, text) to authenticated;

-- ── 3. Comptage des appels traités ───────────────────────────────────────────
-- Incrémente le compteur du mois en cours et calcule le dépassement par
-- rapport au volume inclus dans le forfait. Appelé après chaque appel traité.
create or replace function public.count_handled_call(p_org uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_period date := date_trunc('month', now())::date;
  v_included integer;
  v_handled integer;
begin
  select coalesce(plan_calls_included, 0) into v_included
    from public.organizations where id = p_org;

  insert into public.usage_counters (org_id, period_start, calls_handled, overage_calls, computed_at)
       values (p_org, v_period, 1, 0, now())
  on conflict (org_id, period_start) do update
       set calls_handled = public.usage_counters.calls_handled + 1,
           computed_at   = now()
    returning calls_handled into v_handled;

  update public.usage_counters
     set overage_calls = greatest(0, v_handled - v_included)
   where org_id = p_org and period_start = v_period;
end;
$$;

revoke execute on function public.count_handled_call(uuid) from anon, authenticated;
