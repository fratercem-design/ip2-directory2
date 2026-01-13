-- Member Testimonials Schema

-- Testimonials
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text, -- Optional override (defaults to user profile name)
  testimonial text not null check (char_length(testimonial) >= 10 and char_length(testimonial) <= 1000),
  rating int check (rating >= 1 and rating <= 5), -- Optional 1-5 star rating
  is_approved boolean not null default false, -- Admin approval required
  is_featured boolean not null default false, -- Featured testimonials shown prominently
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_notes text, -- Admin notes (not visible to user)
  approved_by uuid references auth.users(id),
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Testimonial Categories/Tags (optional)
create table if not exists public.testimonial_tags (
  id uuid primary key default gen_random_uuid(),
  testimonial_id uuid not null references public.testimonials(id) on delete cascade,
  tag text not null check (tag in ('community', 'divination', 'streams', 'philosophy', 'growth', 'support', 'rituals')),
  created_at timestamptz not null default now(),
  unique(testimonial_id, tag)
);

-- Indexes
create index if not exists testimonials_user_idx on public.testimonials(user_id, created_at desc);
create index if not exists testimonials_status_idx on public.testimonials(status, is_featured, created_at desc);
create index if not exists testimonials_approved_idx on public.testimonials(is_approved, is_featured, created_at desc) where is_approved = true;
create index if not exists testimonial_tags_testimonial_idx on public.testimonial_tags(testimonial_id);

-- RLS Policies
alter table public.testimonials enable row level security;
alter table public.testimonial_tags enable row level security;

-- Public can read approved testimonials
create policy "public_read_approved_testimonials"
on public.testimonials for select to anon
using (is_approved = true and status = 'approved');

-- Authenticated users can read approved testimonials
create policy "authenticated_read_approved_testimonials"
on public.testimonials for select to authenticated
using (is_approved = true and status = 'approved');

-- Users can read their own testimonials (regardless of status)
create policy "users_read_own_testimonials"
on public.testimonials for select to authenticated
using (auth.uid() = user_id);

-- Users can create their own testimonials
create policy "users_create_own_testimonials"
on public.testimonials for insert to authenticated
with check (auth.uid() = user_id);

-- Users can update their own pending testimonials
create policy "users_update_own_pending_testimonials"
on public.testimonials for update to authenticated
using (auth.uid() = user_id and status = 'pending')
with check (auth.uid() = user_id);

-- Users can delete their own testimonials
create policy "users_delete_own_testimonials"
on public.testimonials for delete to authenticated
using (auth.uid() = user_id);

-- Public can read tags for approved testimonials
create policy "public_read_testimonial_tags"
on public.testimonial_tags for select to anon
using (
  exists (
    select 1 from public.testimonials t
    where t.id = testimonial_id
    and t.is_approved = true
    and t.status = 'approved'
  )
);

-- Authenticated users can read tags for approved testimonials
create policy "authenticated_read_testimonial_tags"
on public.testimonial_tags for select to authenticated
using (
  exists (
    select 1 from public.testimonials t
    where t.id = testimonial_id
    and t.is_approved = true
    and t.status = 'approved'
  )
);

-- Users can manage tags for their own testimonials
create policy "users_manage_own_testimonial_tags"
on public.testimonial_tags for all to authenticated
using (
  exists (
    select 1 from public.testimonials t
    where t.id = testimonial_id
    and t.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.testimonials t
    where t.id = testimonial_id
    and t.user_id = auth.uid()
  )
);
