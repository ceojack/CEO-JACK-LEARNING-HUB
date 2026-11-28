alter table public.courses
  add column if not exists price numeric(10,2) not null default 0 check (price >= 0),
  add column if not exists image_url text,
  add column if not exists status text not null default 'draft' check (status in ('draft', 'published'));
