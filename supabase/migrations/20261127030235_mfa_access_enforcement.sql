create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create or replace function private.can_access_account_data()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null
    and case
      when lower(coalesce((select auth.jwt())->>'email', '')) = 'adminjack1@gmail.com'
        then coalesce((select auth.jwt())->>'aal', '') = 'aal2'
      else coalesce((select auth.jwt())->>'aal', '') = 'aal2'
        or not coalesce((
          select p.mfa_enabled
          from public.profiles as p
          where p.id = (select auth.uid())
        ), false)
    end;
$$;
revoke all on function private.can_access_account_data() from public, anon;
grant execute on function private.can_access_account_data() to authenticated;

drop policy if exists "Learners can create their profile" on public.profiles;
create policy "Learners can create their profile"
  on public.profiles for insert to authenticated
  with check ((select auth.uid()) = id and (select private.can_access_account_data()));

drop policy if exists "Learners can update their profile" on public.profiles;
create policy "Learners can update their profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id and (select private.can_access_account_data()))
  with check ((select auth.uid()) = id and (select private.can_access_account_data()));

drop policy if exists "Learners can delete their profile" on public.profiles;
create policy "Learners can delete their profile"
  on public.profiles for delete to authenticated
  using ((select auth.uid()) = id and (select private.can_access_account_data()));

drop policy if exists "Learners can manage their own enrollments" on public.enrollments;
create policy "Learners can manage their own enrollments"
  on public.enrollments for all to authenticated
  using ((select auth.uid()) = user_id and (select private.can_access_account_data()))
  with check ((select auth.uid()) = user_id and (select private.can_access_account_data()));

drop policy if exists "Learners can read their progress" on public.lesson_progress;
create policy "Learners can read their progress"
  on public.lesson_progress for select to authenticated
  using ((select auth.uid()) = user_id and (select private.can_access_account_data()));

drop policy if exists "Learners can create their progress" on public.lesson_progress;
create policy "Learners can create their progress"
  on public.lesson_progress for insert to authenticated
  with check ((select auth.uid()) = user_id and (select private.can_access_account_data()));

drop policy if exists "Learners can update their progress" on public.lesson_progress;
create policy "Learners can update their progress"
  on public.lesson_progress for update to authenticated
  using ((select auth.uid()) = user_id and (select private.can_access_account_data()))
  with check ((select auth.uid()) = user_id and (select private.can_access_account_data()));

drop policy if exists "Learners can delete their progress" on public.lesson_progress;
create policy "Learners can delete their progress"
  on public.lesson_progress for delete to authenticated
  using ((select auth.uid()) = user_id and (select private.can_access_account_data()));

drop policy if exists "Members can read their own verified card" on public.verified_member_cards;
create policy "Members can read their own verified card"
  on public.verified_member_cards for select to authenticated
  using ((select auth.uid()) = user_id and (select private.can_access_account_data()));

drop policy if exists "Members can create their own verified card" on public.verified_member_cards;
create policy "Members can create their own verified card"
  on public.verified_member_cards for insert to authenticated
  with check ((select auth.uid()) = user_id and (select private.can_access_account_data()));

drop policy if exists "Members can update their own verified card" on public.verified_member_cards;
create policy "Members can update their own verified card"
  on public.verified_member_cards for update to authenticated
  using ((select auth.uid()) = user_id and (select private.can_access_account_data()))
  with check ((select auth.uid()) = user_id and (select private.can_access_account_data()));
