-- Durcissement : ces fonctions SECURITY DEFINER ne doivent pas être appelables
-- via l'API REST publique (alertes du linter de sécurité Supabase).
--  * count_handled_call : n'est appelée que par le webhook vocal (service_role,
--    qui contourne ces droits). Sans ce revoke, un utilisateur connecté pouvait
--    incrémenter le compteur d'appels de N'IMPORTE quelle org via /rpc.
--  * auto_confirm_user : simple trigger BEFORE INSERT sur auth.users ; le trigger
--    s'exécute indépendamment de ce droit, donc l'inscription n'est pas affectée.
revoke execute on function public.count_handled_call(uuid) from public, anon, authenticated;
revoke execute on function public.auto_confirm_user() from public, anon, authenticated;
