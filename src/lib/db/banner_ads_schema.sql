-- Banner Advertising System Schema

-- Ad Campaigns
create table if not exists public.ad_campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  advertiser_name text,
  advertiser_email text,
  is_active boolean not null default true,
  start_date date,
  end_date date,
  budget numeric(10, 2), -- Optional budget tracking
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Banner Ads
create table if not exists public.banner_ads (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.ad_campaigns(id) on delete cascade,
  title text not null,
  image_url text not null,
  link_url text not null,
  alt_text text,
  ad_size text not null check (ad_size in ('banner', 'sidebar', 'square', 'skyscraper', 'leaderboard')),
  position text not null check (position in ('top', 'bottom', 'sidebar', 'inline', 'floating')),
  target_pages text[], -- Array of page paths (e.g., ['/blog', '/about'])
  exclude_pages text[], -- Pages to exclude
  is_active boolean not null default true,
  priority int not null default 0, -- Higher priority shows first
  start_date date,
  end_date date,
  max_impressions int, -- Optional impression limit
  max_clicks int, -- Optional click limit
  current_impressions int not null default 0,
  current_clicks int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Ad Impressions (Views)
create table if not exists public.ad_impressions (
  id uuid primary key default gen_random_uuid(),
  ad_id uuid not null references public.banner_ads(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  page_path text,
  ip_address text,
  user_agent text,
  viewed_at timestamptz not null default now()
);

-- Ad Clicks
create table if not exists public.ad_clicks (
  id uuid primary key default gen_random_uuid(),
  ad_id uuid not null references public.banner_ads(id) on delete cascade,
  impression_id uuid references public.ad_impressions(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  page_path text,
  ip_address text,
  user_agent text,
  clicked_at timestamptz not null default now()
);

-- Indexes
create index if not exists banner_ads_active_idx on public.banner_ads(is_active, priority desc, start_date, end_date) where is_active = true;
create index if not exists banner_ads_position_idx on public.banner_ads(position, is_active) where is_active = true;
create index if not exists banner_ads_campaign_idx on public.banner_ads(campaign_id);
create index if not exists ad_impressions_ad_idx on public.ad_impressions(ad_id, viewed_at desc);
create index if not exists ad_clicks_ad_idx on public.ad_clicks(ad_id, clicked_at desc);
create index if not exists ad_campaigns_active_idx on public.ad_campaigns(is_active, start_date, end_date);

-- Function to increment impression count
create or replace function increment_ad_impression()
returns trigger as $$
begin
  update public.banner_ads
  set current_impressions = current_impressions + 1
  where id = new.ad_id;
  return new;
end;
$$ language plpgsql;

-- Trigger to increment impression count
create trigger ad_impressions_increment_count
after insert on public.ad_impressions
for each row execute function increment_ad_impression();

-- Function to increment click count
create or replace function increment_ad_click()
returns trigger as $$
begin
  update public.banner_ads
  set current_clicks = current_clicks + 1
  where id = new.ad_id;
  return new;
end;
$$ language plpgsql;

-- Trigger to increment click count
create trigger ad_clicks_increment_count
after insert on public.ad_clicks
for each row execute function increment_ad_click();

-- RLS Policies
alter table public.ad_campaigns enable row level security;
alter table public.banner_ads enable row level security;
alter table public.ad_impressions enable row level security;
alter table public.ad_clicks enable row level security;

-- Public can read active campaigns
create policy "public_read_active_campaigns"
on public.ad_campaigns for select to anon
using (is_active = true);

-- Public can read active ads
create policy "public_read_active_ads"
on public.banner_ads for select to anon
using (is_active = true);

-- Authenticated users can read active ads
create policy "authenticated_read_active_ads"
on public.banner_ads for select to authenticated
using (is_active = true);

-- Public can create impressions
create policy "public_create_impressions"
on public.ad_impressions for insert to anon
with check (true);

-- Authenticated users can create impressions
create policy "authenticated_create_impressions"
on public.ad_impressions for insert to authenticated
with check (true);

-- Public can create clicks
create policy "public_create_clicks"
on public.ad_clicks for insert to anon
with check (true);

-- Authenticated users can create clicks
create policy "authenticated_create_clicks"
on public.ad_clicks for insert to authenticated
with check (true);
