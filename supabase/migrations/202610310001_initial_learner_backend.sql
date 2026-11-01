create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  level text not null check (level in ('Primary', 'Secondary', 'Higher Education', 'Independent Learner')),
  age_group text not null check (age_group in ('Under 13', '13 - 15', '16 - 18', '19 - 24', '25+')),
  interests text[] not null default '{}',
  goals text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_interests_allowed check (
    interests <@ array['School & Education', 'Web Development', 'Programming', 'AI', 'Business', 'Design']::text[]
    and cardinality(interests) between 1 and 6
  ),
  constraint profiles_goals_allowed check (
    goals <@ array['Improve school results', 'Learn digital skills', 'Build projects', 'Start a small idea']::text[]
    and cardinality(goals) between 1 and 4
  )
);

create table if not exists public.lesson_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id text not null check (lesson_id in ('p7-maths-equivalent-fractions')),
  status text not null check (status in ('completed')),
  score smallint not null check (score between 2 and 3),
  completed_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
revoke all on function public.set_updated_at() from public, anon, authenticated;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists lesson_progress_set_updated_at on public.lesson_progress;
create trigger lesson_progress_set_updated_at
  before update on public.lesson_progress
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.lesson_progress enable row level security;

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.lesson_progress from anon, authenticated;
grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, update, delete on table public.lesson_progress to authenticated;

drop policy if exists "Learners can read their profile" on public.profiles;
create policy "Learners can read their profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "Learners can create their profile" on public.profiles;
create policy "Learners can create their profile"
  on public.profiles for insert to authenticated
  with check ((select auth.uid()) = id);

drop policy if exists "Learners can update their profile" on public.profiles;
create policy "Learners can update their profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "Learners can delete their profile" on public.profiles;
create policy "Learners can delete their profile"
  on public.profiles for delete to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "Learners can read their progress" on public.lesson_progress;
create policy "Learners can read their progress"
  on public.lesson_progress for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Learners can create their progress" on public.lesson_progress;
create policy "Learners can create their progress"
  on public.lesson_progress for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Learners can update their progress" on public.lesson_progress;
create policy "Learners can update their progress"
  on public.lesson_progress for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Learners can delete their progress" on public.lesson_progress;
create policy "Learners can delete their progress"
  on public.lesson_progress for delete to authenticated
  using ((select auth.uid()) = user_id);

create index if not exists lesson_progress_user_updated_idx
  on public.lesson_progress (user_id, updated_at desc);
