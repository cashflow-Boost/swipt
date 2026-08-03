-- Rimova — nouvelle grille tarifaire.
-- Solo 99 € (80 appels inclus) · Pro 199 € et Agence 399 € (appels illimités).
alter table public.organizations
  drop constraint if exists organizations_plan_check;

alter table public.organizations
  add constraint organizations_plan_check
  check (plan in ('solo','pro','agence'));

update public.organizations set plan = 'pro'    where plan = 'equipe';
update public.organizations set plan = 'agence' where plan = 'pro' and plan_calls_included = 480;

update public.organizations
   set plan_calls_included = 80
 where plan = 'solo';

-- onboard() crée désormais un compte Solo à 80 appels inclus.
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

  insert into public.organizations (name, trade, plan, plan_calls_included, trial_ends_at, subscription_status)
    values (p_org_name, p_trade, 'solo', 80, now() + interval '7 days', 'trialing')
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
