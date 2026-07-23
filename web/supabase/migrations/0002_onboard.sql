-- Onboarding : crée l'organisation et lie l'utilisateur connecté (owner).
-- SECURITY DEFINER pour contourner la RLS au premier pas (l'utilisateur n'a pas
-- encore d'org, donc current_org_id() renverrait null). Idempotent.
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

  insert into public.organizations (name, trade, plan, plan_calls_included)
    values (p_org_name, p_trade, 'solo', 130)
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
