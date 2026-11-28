-- Reconcile policies and helper function privileges from the original
-- dashboard setup with the current learner backend.

-- Keep one explicit owner-only policy set for learner profiles.
drop policy if exists "own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can view own profile" on public.profiles;

-- The app uses the learner profile and progress tables; enrollments are
-- retained for the course catalog setup and remain private to signed-in owners.
drop policy if exists "own enrollment" on public.enrollments;
create policy "Learners can manage their own enrollments"
  on public.enrollments for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- These functions are called by database triggers, not through the REST API.
-- Pin the SECURITY DEFINER signup helper's search path and remove public RPC
-- execution from both trigger helpers.
alter function public.handle_new_user() set search_path = '';
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.rls_auto_enable() from public, anon, authenticated;

-- Cover foreign keys used by course enrollment and lesson listing queries.
create index if not exists enrollments_user_id_idx
  on public.enrollments (user_id);
create index if not exists enrollments_course_id_idx
  on public.enrollments (course_id);
create index if not exists lessons_course_id_idx
  on public.lessons (course_id);
