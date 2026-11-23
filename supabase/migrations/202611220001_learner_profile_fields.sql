alter table public.profiles
  add column if not exists display_name text,
  add column if not exists email text,
  add column if not exists hobby text not null default '',
  add column if not exists avatar_url text,
  add column if not exists learning_level text,
  add column if not exists jack_ai_memory text not null default '';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_learning_level_allowed'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_learning_level_allowed
      check (
        learning_level is null
        or learning_level in ('Primary', 'Secondary', 'Higher Education', 'Independent Learner')
      );
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_hobby_length'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_hobby_length
      check (char_length(hobby) <= 100);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_display_name_length'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_display_name_length
      check (display_name is null or char_length(display_name) between 1 and 80);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_jack_ai_memory_length'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_jack_ai_memory_length
      check (char_length(jack_ai_memory) <= 800);
  end if;
end
$$;

update public.profiles
set learning_level = level
where learning_level is null;
