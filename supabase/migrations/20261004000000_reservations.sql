create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  phone text not null check (char_length(phone) between 6 and 24),
  email text check (email is null or char_length(email) <= 120),
  date date not null,
  time text not null check (time ~ '^[0-2][0-9]:[0-5][0-9]$'),
  party_size int not null check (party_size between 1 and 40),
  occasion text,
  notes text check (notes is null or char_length(notes) <= 500),
  locale text not null default 'es',
  source text not null default 'web' check (source in ('web','ai')),
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled')),
  created_at timestamptz not null default now()
);

-- Only the server (service role) writes or reads. No policies = no anon/auth access.
alter table public.reservations enable row level security;

create index if not exists reservations_date_idx on public.reservations (date, time);

create table if not exists public.club_subscribers (
  email text primary key check (char_length(email) <= 120),
  locale text not null default 'es',
  created_at timestamptz not null default now()
);
alter table public.club_subscribers enable row level security;
