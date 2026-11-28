grant select on table public.courses to anon, authenticated;
grant insert, update, delete on table public.courses to authenticated;

alter table public.courses enable row level security;

drop policy if exists "Admin can manage courses after MFA" on public.courses;
create policy "Admin can manage courses after MFA"
  on public.courses for all to authenticated
  using ((select public.is_admin_with_mfa()))
  with check ((select public.is_admin_with_mfa()));
