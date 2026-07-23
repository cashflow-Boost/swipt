-- SWIPT — schéma de base (SPEC §7)
-- Multi-tenant : une entreprise artisanale = une organisation.
-- Règles dures : montants en centimes entiers (SPEC §13) ; RLS sur TOUTES les
-- tables, sans exception (SPEC §7).

-- ─────────────────────────────────────────────────────────────
-- Tables
-- ─────────────────────────────────────────────────────────────
create table public.organizations (
  id                     uuid primary key default gen_random_uuid(),
  name                   text not null,
  siren                  text,
  trade                  text,
  phone_number           text,
  plan                   text check (plan in ('solo','equipe','pro')),
  plan_calls_included    integer not null default 0,
  trial_ends_at          timestamptz,
  stripe_customer_id     text,
  stripe_subscription_id text,
  created_at             timestamptz not null default now()
);

create table public.users (
  id        uuid primary key references auth.users (id) on delete cascade,
  org_id    uuid not null references public.organizations (id) on delete cascade,
  email     text not null,
  full_name text,
  role      text not null default 'member' check (role in ('owner','member'))
);

create table public.agent_settings (
  org_id           uuid primary key references public.organizations (id) on delete cascade,
  announced_name   text,
  trade            text,
  zone_center      text,
  zone_radius_km   integer,
  business_hours   jsonb not null default '{}'::jsonb,
  ring_count       integer not null default 4,
  callout_fee_cents integer not null default 0,
  urgent_triggers  jsonb not null default '[]'::jsonb,
  refusal_rules    jsonb not null default '[]'::jsonb,
  updated_at       timestamptz not null default now()
);

create table public.customers (
  id            uuid primary key default gen_random_uuid(),
  org_id        uuid not null references public.organizations (id) on delete cascade,
  phone         text,
  full_name     text,
  address       text,
  floor         text,
  access_code   text,
  notes         text,
  first_seen_at timestamptz,
  created_at    timestamptz not null default now()
);

create table public.calls (
  id               uuid primary key default gen_random_uuid(),
  org_id           uuid not null references public.organizations (id) on delete cascade,
  customer_id      uuid references public.customers (id) on delete set null,
  started_at       timestamptz not null default now(),
  duration_seconds integer,
  direction        text not null default 'inbound' check (direction in ('inbound','outbound')),
  status           text check (status in ('handled','transferred','out_of_zone','discarded')),
  recording_url    text,
  transcript       jsonb,
  extraction       jsonb,
  urgency          text check (urgency in ('low','normal','high','critical')),
  cost_cents       integer,               -- coût mesuré réel (SPEC §5.4)
  counted_in_quota boolean not null default true,
  corrected_by     uuid references public.users (id) on delete set null,
  corrected_at     timestamptz
);

create table public.appointments (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references public.organizations (id) on delete cascade,
  customer_id uuid references public.customers (id) on delete set null,
  call_id     uuid references public.calls (id) on delete set null,
  starts_at   timestamptz not null,
  ends_at     timestamptz not null,
  source      text not null check (source in ('agent','manual')),
  locked      boolean not null default false,   -- créneau intouchable par l'agent (SPEC §4.2)
  status      text,
  notes       text
);

create table public.price_items (
  id               uuid primary key default gen_random_uuid(),
  org_id           uuid not null references public.organizations (id) on delete cascade,
  label            text not null,
  unit             text,
  unit_price_cents integer not null default 0,
  vat_rate         numeric(4,1) not null default 20 check (vat_rate in (20, 10, 5.5)),
  trade_category   text
);

create table public.quotes (
  id              uuid primary key default gen_random_uuid(),
  org_id          uuid not null references public.organizations (id) on delete cascade,
  customer_id     uuid references public.customers (id) on delete set null,
  call_id         uuid references public.calls (id) on delete set null,
  number          text,
  status          text not null default 'draft'
                    check (status in ('draft','to_validate','sent','signed','expired')),
  lines           jsonb not null default '[]'::jsonb,
  total_ht_cents  integer not null default 0,
  total_ttc_cents integer not null default 0,
  vat_breakdown   jsonb not null default '{}'::jsonb,
  sent_at         timestamptz,
  signed_at       timestamptz,
  signature_data  jsonb
);

create table public.invoices (
  id              uuid primary key default gen_random_uuid(),
  org_id          uuid not null references public.organizations (id) on delete cascade,
  quote_id        uuid references public.quotes (id) on delete set null,
  number          text,
  status          text not null default 'issued' check (status in ('issued','paid','overdue')),
  due_date        date,
  total_ttc_cents integer not null default 0,
  facturx_url     text,
  paid_at         timestamptz
);

create table public.reminders (
  id             uuid primary key default gen_random_uuid(),
  org_id         uuid not null references public.organizations (id) on delete cascade,
  target_type    text not null check (target_type in ('quote','invoice')),
  target_id      uuid not null,
  rule           text,
  sequence_index integer not null default 0,
  sent_at        timestamptz,
  outcome        text check (outcome in ('pending','converted','no_reply'))
);

create table public.usage_counters (
  org_id        uuid not null references public.organizations (id) on delete cascade,
  period_start  date not null,
  calls_handled integer not null default 0,
  overage_calls integer not null default 0,
  computed_at   timestamptz not null default now(),
  primary key (org_id, period_start)
);

-- Index sur la clé de cloisonnement (chemin d'accès dominant).
create index on public.users (org_id);
create index on public.customers (org_id);
create index on public.calls (org_id, started_at desc);
create index on public.appointments (org_id, starts_at);
create index on public.price_items (org_id);
create index on public.quotes (org_id, status);
create index on public.invoices (org_id, status);
create index on public.reminders (org_id);

-- ─────────────────────────────────────────────────────────────
-- Résolution de l'organisation courante.
-- SPEC §7 : « org_id = auth.jwt() -> org_id ». On lit d'abord le claim JWT
-- (à alimenter par un Custom Access Token Hook Supabase), avec repli sur la
-- table users. SECURITY DEFINER pour éviter la récursion RLS sur users.
-- Créée après les tables : son corps SQL référence public.users, validé à la
-- création.
-- ─────────────────────────────────────────────────────────────
create or replace function public.current_org_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    nullif(current_setting('request.jwt.claims', true)::jsonb ->> 'org_id', '')::uuid,
    (select u.org_id from public.users u where u.id = auth.uid())
  );
$$;

-- ─────────────────────────────────────────────────────────────
-- RLS — SPEC §7 : obligatoire sur toutes les tables, aucune exception.
-- ─────────────────────────────────────────────────────────────
alter table public.organizations  enable row level security;
alter table public.users          enable row level security;
alter table public.agent_settings enable row level security;
alter table public.customers      enable row level security;
alter table public.calls          enable row level security;
alter table public.appointments   enable row level security;
alter table public.price_items    enable row level security;
alter table public.quotes         enable row level security;
alter table public.invoices       enable row level security;
alter table public.reminders      enable row level security;
alter table public.usage_counters enable row level security;

-- L'organisation : visible seulement si c'est la sienne.
create policy org_isolation on public.organizations
  for all using (id = public.current_org_id())
  with check (id = public.current_org_id());

-- Toutes les autres tables : cloisonnement par org_id.
create policy tenant_isolation on public.users
  for all using (org_id = public.current_org_id()) with check (org_id = public.current_org_id());
create policy tenant_isolation on public.agent_settings
  for all using (org_id = public.current_org_id()) with check (org_id = public.current_org_id());
create policy tenant_isolation on public.customers
  for all using (org_id = public.current_org_id()) with check (org_id = public.current_org_id());
create policy tenant_isolation on public.calls
  for all using (org_id = public.current_org_id()) with check (org_id = public.current_org_id());
create policy tenant_isolation on public.appointments
  for all using (org_id = public.current_org_id()) with check (org_id = public.current_org_id());
create policy tenant_isolation on public.price_items
  for all using (org_id = public.current_org_id()) with check (org_id = public.current_org_id());
create policy tenant_isolation on public.quotes
  for all using (org_id = public.current_org_id()) with check (org_id = public.current_org_id());
create policy tenant_isolation on public.invoices
  for all using (org_id = public.current_org_id()) with check (org_id = public.current_org_id());
create policy tenant_isolation on public.reminders
  for all using (org_id = public.current_org_id()) with check (org_id = public.current_org_id());
create policy tenant_isolation on public.usage_counters
  for all using (org_id = public.current_org_id()) with check (org_id = public.current_org_id());
