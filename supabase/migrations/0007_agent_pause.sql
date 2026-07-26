-- SWIPT — « Je reprends la main » (SPEC §4.9)
-- L'artisan peut mettre l'agent en pause : SWIPT ne décroche plus, l'artisan
-- répond lui-même. État porté par l'organisation, respecté par le webhook vocal.

alter table public.organizations
  add column if not exists agent_paused boolean not null default false;

comment on column public.organizations.agent_paused is
  'Quand true, l''agent vocal ne prend plus les appels (l''artisan a repris la main).';
