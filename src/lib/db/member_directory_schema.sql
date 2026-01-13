-- Member Directory Schema

-- User Profiles (Public-facing member info)
create table if not exists public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  display_name text,
  bio text,
  avatar_url text,
  is_public boolean not null default true, -- Allow listing in directory
  show_tokens boolean not null default false, -- Privacy: show token balance
  show_activity boolean not null default true, -- Privacy: show activity stats
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Member Stats (Aggregated data for directory)
-- This can be computed via views or updated via triggers
create or replace view public.member_stats as
select 
  u.id as user_id,
  u.email,
  up.display_name,
  up.avatar_url,
  up.is_public,
  up.bio,
  coalesce(ut.balance, 0) as token_balance,
  coalesce(ut.total_earned, 0) as total_tokens_earned,
  (select count(*) from public.follows where user_id = u.id) as follows_count,
  (select count(*) from public.clips where user_id = u.id) as clips_count,
  (select count(*) from public.divination_readings where user_id = u.id) as readings_count,
  u.created_at as member_since
from auth.users u
left join public.user_profiles up on up.user_id = u.id
left join public.user_tokens ut on ut.user_id = u.id
where up.is_public = true or up.is_public is null;

-- Indexes
create index if not exists user_profiles_user_idx on public.user_profiles(user_id);
create index if not exists user_profiles_public_idx on public.user_profiles(is_public) where is_public = true;

-- RLS Policies
alter table public.user_profiles enable row level security;

-- Users can read public profiles
create policy "public_read_public_profiles"
on public.user_profiles for select to anon
using (is_public = true);

-- Authenticated users can read all public profiles
create policy "authenticated_read_public_profiles"
on public.user_profiles for select to authenticated
using (is_public = true);

-- Users can read their own profile
create policy "users_read_own_profile"
on public.user_profiles for select to authenticated
using (auth.uid() = user_id);

-- Users can update their own profile
create policy "users_update_own_profile"
on public.user_profiles for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Users can insert their own profile
create policy "users_insert_own_profile"
on public.user_profiles for insert to authenticated
with check (auth.uid() = user_id);
