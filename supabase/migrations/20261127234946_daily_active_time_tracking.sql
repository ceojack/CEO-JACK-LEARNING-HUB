create table if not exists public.activity_daily (
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_date date not null default current_date,
  active_seconds integer not null default 0 check (active_seconds >= 0),
  last_active_at timestamptz not null default now(),
  primary key (user_id, activity_date)
);

create index if not exists activity_daily_last_active_idx on public.activity_daily (last_active_at desc);
alter table public.activity_daily enable row level security;
revoke all on table public.activity_daily from anon, public;
grant select, insert, update on table public.activity_daily to authenticated;

drop policy if exists "Users can read their own active time" on public.activity_daily;
create policy "Users can read their own active time"
  on public.activity_daily for select to authenticated
  using (user_id = (select auth.uid()) and (select private.can_access_account_data()));

drop policy if exists "Users can start their own active time" on public.activity_daily;
create policy "Users can start their own active time"
  on public.activity_daily for insert to authenticated
  with check (user_id = (select auth.uid()) and (select private.can_access_account_data()));

drop policy if exists "Users can update their own active time" on public.activity_daily;
create policy "Users can update their own active time"
  on public.activity_daily for update to authenticated
  using (user_id = (select auth.uid()) and (select private.can_access_account_data()))
  with check (user_id = (select auth.uid()) and (select private.can_access_account_data()));

drop policy if exists "Admins can read active time after MFA" on public.activity_daily;
create policy "Admins can read active time after MFA"
  on public.activity_daily for select to authenticated
  using ((select public.is_admin_with_mfa()));
