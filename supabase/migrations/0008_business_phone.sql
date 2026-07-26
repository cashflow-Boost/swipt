-- SWIPT — numéro professionnel de l'artisan (celui que ses clients composent).
-- Distinct de organizations.phone_number, qui est le numéro SWIPT vers lequel
-- l'artisan renvoie ses appels sans réponse (SPEC §3, renvoi conditionnel).

alter table public.agent_settings
  add column if not exists business_phone text;

comment on column public.agent_settings.business_phone is
  'Numéro professionnel de l''artisan, celui communiqué à ses clients.';
comment on column public.organizations.phone_number is
  'Numéro SWIPT attribué à l''organisation : cible du renvoi conditionnel et clé de routage des appels entrants.';
