-- Contourne la confirmation e-mail sans réglage dashboard : chaque nouvel
-- utilisateur est confirmé automatiquement à l'insertion, et l'app se connecte
-- dans la foulée (voir app/signup). Choix produit assumé (essai sans friction).
create or replace function public.auto_confirm_user()
returns trigger
language plpgsql
security definer
set search_path = auth, public
as $$
begin
  if new.email_confirmed_at is null then
    new.email_confirmed_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists auto_confirm_user_trigger on auth.users;
create trigger auto_confirm_user_trigger
  before insert on auth.users
  for each row execute function public.auto_confirm_user();

update auth.users set email_confirmed_at = now() where email_confirmed_at is null;
