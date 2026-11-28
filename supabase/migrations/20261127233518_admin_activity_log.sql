create table if not exists public.admin_activity_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references auth.users(id) on delete restrict,
  action text not null check (char_length(action) between 1 and 120),
  target_type text not null check (char_length(target_type) between 1 and 80),
  target_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists admin_activity_log_created_at_idx on public.admin_activity_log (created_at desc);
alter table public.admin_activity_log enable row level security;
revoke all on table public.admin_activity_log from anon, public;
grant select, insert on table public.admin_activity_log to authenticated;

drop policy if exists "Admins can read activity log after MFA" on public.admin_activity_log;
create policy "Admins can read activity log after MFA"
  on public.admin_activity_log for select to authenticated
  using ((select public.is_admin_with_mfa()));

drop policy if exists "Admins can record activity after MFA" on public.admin_activity_log;
create policy "Admins can record activity after MFA"
  on public.admin_activity_log for insert to authenticated
  with check (actor_id = (select auth.uid()) and (select public.is_admin_with_mfa()));
