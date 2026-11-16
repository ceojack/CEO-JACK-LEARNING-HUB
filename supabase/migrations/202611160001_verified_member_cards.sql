create table if not exists public.verified_member_cards (
  user_id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 80),
  photo_url text not null,
  hobby text not null check (char_length(hobby) between 1 and 60),
  level text not null check (level in ('Beginner', 'Intermediate', 'Pro', 'Master')),
  motto varchar(35) not null default '',
  member_id text not null unique,
  card_colour text not null check (card_colour in ('royal-black', 'ocean-blue', 'emerald-green', 'royal-purple', 'sunset-orange')),
  qr_url text not null,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.verified_member_cards enable row level security;
revoke all on table public.verified_member_cards from anon, authenticated;
grant select, insert, update on table public.verified_member_cards to authenticated;

drop policy if exists "Members can read their own verified card" on public.verified_member_cards;
create policy "Members can read their own verified card"
  on public.verified_member_cards for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Members can create their own verified card" on public.verified_member_cards;
create policy "Members can create their own verified card"
  on public.verified_member_cards for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Members can update their own verified card" on public.verified_member_cards;
create policy "Members can update their own verified card"
  on public.verified_member_cards for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop trigger if exists verified_member_cards_set_updated_at on public.verified_member_cards;
create trigger verified_member_cards_set_updated_at
  before update on public.verified_member_cards
  for each row execute function public.set_updated_at();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('verified-member-photos', 'verified-member-photos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Members can upload their verified card photo" on storage.objects;
create policy "Members can upload their verified card photo"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'verified-member-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "Members can replace their verified card photo" on storage.objects;
create policy "Members can replace their verified card photo"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'verified-member-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'verified-member-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create or replace function public.get_public_verified_member_card(p_member_id text)
returns table (
  full_name text,
  photo_url text,
  hobby text,
  level text,
  motto text,
  member_id text,
  card_colour text,
  qr_url text,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select c.full_name, c.photo_url, c.hobby, c.level, c.motto,
         c.member_id, c.card_colour, c.qr_url, c.created_at
  from public.verified_member_cards as c
  where c.member_id = p_member_id and c.is_verified = true
  limit 1;
$$;

revoke all on function public.get_public_verified_member_card(text) from public;
grant execute on function public.get_public_verified_member_card(text) to anon, authenticated;
