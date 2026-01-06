
-- Phase 4: Metagame (Follows & Clips)

-- 1. Follows
-- Tracks which users follow which streamers
create table if not exists public.follows (
  user_id uuid not null references auth.users(id) on delete cascade,
  streamer_id uuid not null references public.streamers(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, streamer_id)
);

-- 2. Clips (Bookmarks)
-- User-generated timestamps/links
create table if not exists public.clips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  streamer_id uuid not null references public.streamers(id) on delete cascade,
  live_session_id uuid references public.live_sessions(id) on delete set null,
  title text not null,
  url text not null, -- Deep link with timestamp
  created_at timestamptz not null default now()
);

-- RLS Policies

alter table public.follows enable row level security;
alter table public.clips enable row level security;

-- Follows: Users can read their own follows, create their own, delete their own
create policy "follows_read_own" on public.follows
  for select to authenticated using (auth.uid() = user_id);

-- (Optional) If we want "Followers Count" public, we might need a separate count table or public read.
-- For now, let's allow public read of follows to enable "Popularity" queries if needed, 
-- BUT privacy-wise, maybe users don't want their follows public.
-- Let's stick to: Users see their own follows. 
-- To fetch "Am I following?", the client queries this table.

create policy "follows_insert_own" on public.follows
  for insert to authenticated with check (auth.uid() = user_id);

create policy "follows_delete_own" on public.follows
  for delete to authenticated using (auth.uid() = user_id);


-- Clips: Public Read, Owner Write
create policy "clips_read_public" on public.clips
  for select to anon, authenticated using (true);

create policy "clips_insert_own" on public.clips
  for insert to authenticated with check (auth.uid() = user_id);

create policy "clips_update_own" on public.clips
  for update to authenticated using (auth.uid() = user_id);

create policy "clips_delete_own" on public.clips
  for delete to authenticated using (auth.uid() = user_id);
