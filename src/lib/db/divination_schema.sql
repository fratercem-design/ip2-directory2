-- Divination System Schema

-- Saved Readings
create table if not exists public.divination_readings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  method text not null check (method in ('tarot', 'oracle', 'lineage', 'serpent')),
  cards jsonb not null, -- Array of card objects
  interpretation text not null,
  created_at timestamptz not null default now()
);

-- Reading Favorites
create table if not exists public.reading_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  reading_id uuid not null references public.divination_readings(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, reading_id)
);

-- Indexes
create index if not exists divination_readings_user_idx on public.divination_readings(user_id, created_at desc);
create index if not exists reading_favorites_user_idx on public.reading_favorites(user_id);

-- RLS Policies
alter table public.divination_readings enable row level security;
alter table public.reading_favorites enable row level security;

-- Users can read their own readings
create policy "users_read_own_readings"
on public.divination_readings for select to authenticated
using (auth.uid() = user_id);

-- Users can create their own readings
create policy "users_create_own_readings"
on public.divination_readings for insert to authenticated
with check (auth.uid() = user_id);

-- Users can delete their own readings
create policy "users_delete_own_readings"
on public.divination_readings for delete to authenticated
using (auth.uid() = user_id);

-- Users can manage their own favorites
create policy "users_manage_own_favorites"
on public.reading_favorites for all to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
