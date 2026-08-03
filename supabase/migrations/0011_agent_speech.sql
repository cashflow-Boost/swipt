-- Gildra — ce que dit l'agent : phrase d'accueil et consignes libres.
alter table public.agent_settings
  add column if not exists greeting text,
  add column if not exists custom_instructions text;

comment on column public.agent_settings.greeting is
  'Première phrase de Sonia au décroché ; repli sur une phrase générée si vide.';
comment on column public.agent_settings.custom_instructions is
  'Consignes libres de l''artisan, injectées dans le script de l''agent.';
