-- Message Board Schema

-- Board Categories
create table if not exists public.board_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  slug text not null unique,
  icon text, -- Icon name or emoji
  color text, -- Hex color for category
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Board Topics (Threads)
create table if not exists public.board_topics (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.board_categories(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) >= 3 and char_length(title) <= 200),
  content text not null check (char_length(content) >= 10),
  is_pinned boolean not null default false,
  is_locked boolean not null default false,
  view_count int not null default 0,
  reply_count int not null default 0,
  last_reply_at timestamptz,
  last_reply_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Board Posts (Replies to Topics)
create table if not exists public.board_posts (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.board_topics(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (char_length(content) >= 10),
  is_edited boolean not null default false,
  edited_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Topic Views (Track who viewed what)
create table if not exists public.topic_views (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.board_topics(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade, -- null for anonymous
  viewed_at timestamptz not null default now(),
  unique(topic_id, user_id)
);

-- Topic Reactions (Likes, etc.)
create table if not exists public.topic_reactions (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.board_topics(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  reaction_type text not null default 'like' check (reaction_type in ('like', 'love', 'insightful', 'helpful')),
  created_at timestamptz not null default now(),
  unique(topic_id, user_id, reaction_type)
);

-- Post Reactions
create table if not exists public.post_reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.board_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  reaction_type text not null default 'like' check (reaction_type in ('like', 'love', 'insightful', 'helpful')),
  created_at timestamptz not null default now(),
  unique(post_id, user_id, reaction_type)
);

-- Indexes
create index if not exists board_topics_category_idx on public.board_topics(category_id, created_at desc);
create index if not exists board_topics_user_idx on public.board_topics(user_id, created_at desc);
create index if not exists board_topics_pinned_idx on public.board_topics(is_pinned, created_at desc);
create index if not exists board_posts_topic_idx on public.board_posts(topic_id, created_at asc);
create index if not exists board_posts_user_idx on public.board_posts(user_id, created_at desc);
create index if not exists topic_views_topic_idx on public.topic_views(topic_id);
create index if not exists topic_reactions_topic_idx on public.topic_reactions(topic_id);
create index if not exists post_reactions_post_idx on public.post_reactions(post_id);

-- Function to update topic reply count
create or replace function update_topic_reply_count()
returns trigger as $$
begin
  update public.board_topics
  set
    reply_count = (
      select count(*) from public.board_posts
      where topic_id = new.topic_id
    ),
    last_reply_at = new.created_at,
    last_reply_by = new.user_id,
    updated_at = now()
  where id = new.topic_id;
  return new;
end;
$$ language plpgsql;

-- Trigger to update reply count on post insert
create trigger board_posts_update_topic_count
after insert on public.board_posts
for each row execute function update_topic_reply_count();

-- Function to increment view count
create or replace function increment_topic_view()
returns trigger as $$
begin
  update public.board_topics
  set view_count = view_count + 1
  where id = new.topic_id;
  return new;
end;
$$ language plpgsql;

-- Trigger to increment view count
create trigger topic_views_increment_count
after insert on public.topic_views
for each row execute function increment_topic_view();

-- RLS Policies
alter table public.board_categories enable row level security;
alter table public.board_topics enable row level security;
alter table public.board_posts enable row level security;
alter table public.topic_views enable row level security;
alter table public.topic_reactions enable row level security;
alter table public.post_reactions enable row level security;

-- Public can read active categories
create policy "public_read_categories"
on public.board_categories for select to anon
using (is_active = true);

-- Authenticated users can read categories
create policy "authenticated_read_categories"
on public.board_categories for select to authenticated
using (is_active = true);

-- Public can read topics
create policy "public_read_topics"
on public.board_topics for select to anon;

-- Authenticated users can read topics
create policy "authenticated_read_topics"
on public.board_topics for select to authenticated;

-- Authenticated users can create topics
create policy "authenticated_create_topics"
on public.board_topics for insert to authenticated
with check (auth.uid() = user_id);

-- Users can update their own topics (if not locked)
create policy "users_update_own_topics"
on public.board_topics for update to authenticated
using (auth.uid() = user_id and is_locked = false)
with check (auth.uid() = user_id);

-- Users can delete their own topics
create policy "users_delete_own_topics"
on public.board_topics for delete to authenticated
using (auth.uid() = user_id);

-- Public can read posts
create policy "public_read_posts"
on public.board_posts for select to anon;

-- Authenticated users can read posts
create policy "authenticated_read_posts"
on public.board_posts for select to authenticated;

-- Authenticated users can create posts
create policy "authenticated_create_posts"
on public.board_posts for insert to authenticated
with check (auth.uid() = user_id);

-- Users can update their own posts
create policy "users_update_own_posts"
on public.board_posts for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Users can delete their own posts
create policy "users_delete_own_posts"
on public.board_posts for delete to authenticated
using (auth.uid() = user_id);

-- Public can read views
create policy "public_read_views"
on public.topic_views for select to anon;

-- Authenticated users can create views
create policy "authenticated_create_views"
on public.topic_views for insert to authenticated
with check (auth.uid() = user_id or user_id is null);

-- Public can read reactions
create policy "public_read_reactions"
on public.topic_reactions for select to anon;

-- Authenticated users can manage reactions
create policy "authenticated_manage_reactions"
on public.topic_reactions for all to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Public can read post reactions
create policy "public_read_post_reactions"
on public.post_reactions for select to anon;

-- Authenticated users can manage post reactions
create policy "authenticated_manage_post_reactions"
on public.post_reactions for all to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Insert default categories
insert into public.board_categories (name, description, slug, icon, color, sort_order) values
  ('General Discussion', 'General conversations and community chat', 'general', '💬', '#8b5cf6', 1),
  ('Divination & Readings', 'Share divination experiences and insights', 'divination', '🔮', '#a855f7', 2),
  ('Philosophy & Teachings', 'Discuss the teachings and philosophy of the Cult', 'philosophy', '📜', '#6366f1', 3),
  ('Streams & Content', 'Talk about streams, clips, and content', 'streams', '📺', '#ec4899', 4),
  ('Support & Guidance', 'Seek and offer support to fellow members', 'support', '🤝', '#10b981', 5),
  ('Announcements', 'Official announcements and updates', 'announcements', '📢', '#f59e0b', 0)
on conflict do nothing;
