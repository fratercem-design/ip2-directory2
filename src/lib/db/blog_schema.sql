-- Blog System Schema

-- Blog Posts
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text, -- Short summary
  content text not null,
  post_type text not null check (post_type in ('article', 'horoscope', 'update', 'essay')),
  category text, -- e.g., 'philosophy', 'practice', 'community', 'astrology'
  tags text[],
  featured_image_url text,
  is_published boolean not null default false,
  is_featured boolean not null default false,
  is_ai_generated boolean not null default false,
  ai_model text, -- e.g., 'gpt-4', 'claude', etc.
  author_id uuid references auth.users(id), -- null for AI-generated
  view_count int not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Horoscopes (Daily astrological content)
create table if not exists public.horoscopes (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  sign text not null check (sign in ('aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces')),
  title text not null,
  content text not null,
  is_ai_generated boolean not null default true,
  ai_model text,
  view_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Blog Post Views
create table if not exists public.blog_post_views (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  viewed_at timestamptz not null default now()
);

-- Indexes
create index if not exists blog_posts_type_idx on public.blog_posts(post_type, published_at desc) where is_published = true;
create index if not exists blog_posts_category_idx on public.blog_posts(category, published_at desc) where is_published = true;
create index if not exists blog_posts_published_idx on public.blog_posts(is_published, published_at desc);
create index if not exists blog_posts_featured_idx on public.blog_posts(is_featured, published_at desc) where is_featured = true;
create index if not exists blog_posts_slug_idx on public.blog_posts(slug);
create index if not exists blog_posts_tags_idx on public.blog_posts using gin(tags);
create index if not exists horoscopes_date_idx on public.horoscopes(date desc, sign);
create index if not exists horoscopes_sign_idx on public.horoscopes(sign, date desc);
create index if not exists blog_post_views_post_idx on public.blog_post_views(post_id, viewed_at desc);

-- Full-text search index
create index if not exists blog_posts_search_idx on public.blog_posts using gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(content, '')));

-- Function to increment view count
create or replace function increment_blog_view()
returns trigger as $$
begin
  update public.blog_posts
  set view_count = view_count + 1
  where id = new.post_id;
  return new;
end;
$$ language plpgsql;

-- Trigger to increment view count
create trigger blog_post_views_increment_count
after insert on public.blog_post_views
for each row execute function increment_blog_view();

-- RLS Policies
alter table public.blog_posts enable row level security;
alter table public.horoscopes enable row level security;
alter table public.blog_post_views enable row level security;

-- Public can read published posts
create policy "public_read_published_posts"
on public.blog_posts for select to anon
using (is_published = true);

-- Authenticated users can read published posts
create policy "authenticated_read_published_posts"
on public.blog_posts for select to authenticated
using (is_published = true);

-- Public can read horoscopes
create policy "public_read_horoscopes"
on public.horoscopes for select to anon;

-- Authenticated users can read horoscopes
create policy "authenticated_read_horoscopes"
on public.horoscopes for select to authenticated;

-- Authenticated users can create views
create policy "authenticated_create_views"
on public.blog_post_views for insert to authenticated
with check (true);
