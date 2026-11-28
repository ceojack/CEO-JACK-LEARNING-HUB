alter table public.profiles
  add column if not exists full_name text,
  add column if not exists role text not null default 'learner',
  add column if not exists mfa_enabled boolean not null default false;

alter table public.profiles
  drop constraint if exists profiles_role_allowed;
alter table public.profiles
  add constraint profiles_role_allowed check (role in ('admin', 'learner'));

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
  return new;
end;
$$;
revoke all on function public.enforce_profile_identity() from public, anon, authenticated;

drop trigger if exists profiles_enforce_identity on public.profiles;
create trigger profiles_enforce_identity
  before insert or update on public.profiles
  for each row execute function public.enforce_profile_identity();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    lower(new.email),
    case when lower(new.email) = 'adminjack1@gmail.com' then 'admin' else 'learner' end
  )
  on conflict (id) do update set
    email = excluded.email,
    role = excluded.role,
    full_name = coalesce(public.profiles.full_name, excluded.full_name);
  return new;
end;
$$;
revoke all on function public.handle_new_user() from public, anon, authenticated;

update public.profiles as p
set email = lower(u.email),
    role = case when lower(u.email) = 'adminjack1@gmail.com' then 'admin' else 'learner' end,
    full_name = coalesce(nullif(trim(p.full_name), ''), nullif(trim(p.display_name), ''), u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', split_part(lower(u.email), '@', 1))
from auth.users as u
where u.id = p.id;

create or replace function public.is_admin_with_mfa()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select lower(coalesce((select auth.jwt())->>'email', '')) = 'adminjack1@gmail.com'
    and coalesce((select auth.jwt())->>'aal', '') = 'aal2';
$$;
revoke all on function public.is_admin_with_mfa() from public, anon;
grant execute on function public.is_admin_with_mfa() to authenticated;

drop policy if exists "Admin can read all profiles after MFA" on public.profiles;
create policy "Admin can read all profiles after MFA"
  on public.profiles for select to authenticated
  using ((select public.is_admin_with_mfa()));

drop policy if exists "Admin can manage enrollments after MFA" on public.enrollments;
create policy "Admin can manage enrollments after MFA"
  on public.enrollments for all to authenticated
  using ((select public.is_admin_with_mfa()))
  with check ((select public.is_admin_with_mfa()));

drop policy if exists "Admin can read all lesson progress after MFA" on public.lesson_progress;
create policy "Admin can read all lesson progress after MFA"
  on public.lesson_progress for select to authenticated
  using ((select public.is_admin_with_mfa()));

drop policy if exists "Admin can manage verified cards after MFA" on public.verified_member_cards;
create policy "Admin can manage verified cards after MFA"
  on public.verified_member_cards for all to authenticated
  using ((select public.is_admin_with_mfa()))
  with check ((select public.is_admin_with_mfa()));
