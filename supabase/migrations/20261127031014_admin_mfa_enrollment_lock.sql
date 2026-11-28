alter table public.profiles
  add column if not exists admin_mfa_enrolled boolean not null default false;

create or replace function public.enforce_profile_identity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  account_email text;
  account_name text;
begin
  select lower(u.email), coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name')
    into account_email, account_name
  from auth.users as u
  where u.id = new.id;

  if account_email is null then
    raise exception 'A matching authenticated account is required';
  end if;

  new.email := account_email;
  new.role := case when account_email = 'adminjack1@gmail.com' then 'admin' else 'learner' end;
  new.full_name := coalesce(nullif(trim(new.display_name), ''), account_name, nullif(trim(new.full_name), ''), split_part(account_email, '@', 1));

  if tg_op = 'INSERT' then
    new.admin_mfa_enrolled := false;
  elsif old.admin_mfa_enrolled then
    new.admin_mfa_enrolled := true;
  elsif lower(coalesce((select auth.jwt())->>'email', '')) = 'adminjack1@gmail.com'
      and coalesce((select auth.jwt())->>'aal', '') = 'aal2' then
    new.admin_mfa_enrolled := coalesce(new.admin_mfa_enrolled, false);
  else
    new.admin_mfa_enrolled := false;
  end if;
  return new;
end;
$$;
revoke all on function public.enforce_profile_identity() from public, anon, authenticated;
