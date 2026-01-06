
-- Core Extensions
create extension if not exists "pgcrypto";

-- 1. Streamers (Directory Entities)
create table if not exists public.streamers (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  slug text not null unique,
  bio text,
  avatar_url text,
  is_listed boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Platform Accounts (YT, Twitch, Kick identities)
create table if not exists public.platform_accounts (
  id uuid primary key default gen_random_uuid(),
  streamer_id uuid not null references public.streamers(id) on delete cascade,
  platform text not null check (platform in ('youtube','twitch','kick')),
  platform_user_id text not null, -- Normalized ID (e.g. channel ID)
  platform_username text, 
  channel_url text,
  is_enabled boolean not null default true,
  last_checked_at timestamptz,
  next_check_at timestamptz not null default now(), -- The Poller Priority Queue
  metadata jsonb not null default '{}'::jsonb, -- Store backoff state here
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(platform, platform_user_id)
);

-- 3. Live Sessions (The "Truth" of history + current state)
create table if not exists public.live_sessions (
  id uuid primary key default gen_random_uuid(),
  platform_account_id uuid not null references public.platform_accounts(id) on delete cascade,
  is_live boolean not null default false,
  started_at timestamptz,
  ended_at timestamptz,
  title text,
  category text,
  viewer_count int,
  stream_url text,
  thumbnail_url text,
  raw jsonb not null default '{}'::jsonb, -- Raw API payload for debugging
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Constraint: Only ONE active session per account
create unique index if not exists live_sessions_one_active_per_account
on public.live_sessions(platform_account_id)
where (is_live = true);

-- 4. Status Events (Audit Log)
create table if not exists public.status_events (
  id uuid primary key default gen_random_uuid(),
  platform_account_id uuid not null references public.platform_accounts(id) on delete cascade,
  event_type text not null check (event_type in ('went_live','went_offline','snapshot')),
  occurred_at timestamptz not null default now(),
  payload jsonb not null default '{}'::jsonb
);

-- Indexes for Speed
create index if not exists platform_accounts_due_check_idx on public.platform_accounts(next_check_at) where (is_enabled = true);
create index if not exists live_sessions_live_idx on public.live_sessions(platform_account_id, started_at desc) where (is_live = true);

-- RLS (Public reads only)
alter table public.streamers enable row level security;
alter table public.platform_accounts enable row level security;
alter table public.live_sessions enable row level security;
alter table public.status_events enable row level security;

-- Public can read listed streamers
create policy "public_read_streamers"
on public.streamers for select to anon
using (is_listed = true);

-- Public can read enabled accounts for listed streamers
create policy "public_read_platform_accounts"
on public.platform_accounts for select to anon
using (
  is_enabled = true
  and exists (
    select 1 from public.streamers s
    where s.id = streamer_id and s.is_listed = true
  )
);

-- Public can read active live sessions
create policy "public_read_live_sessions_active"
on public.live_sessions for select to anon
using (is_live = true);

-- Note: No public policy for status_events (internal audit log)
