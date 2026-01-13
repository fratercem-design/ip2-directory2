-- Token Sales Schema

-- Token Sale Requests
create table if not exists public.token_sales (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tokens_amount bigint not null check (tokens_amount > 0),
  sale_price_usd numeric(10, 2) not null check (sale_price_usd > 0),
  exchange_rate numeric(10, 4) not null, -- tokens per dollar
  payment_method text not null check (payment_method in ('cashapp', 'paypal', 'venmo', 'other')),
  payment_info text, -- Cash App tag, PayPal email, etc.
  status text not null default 'pending' check (status in ('pending', 'approved', 'processing', 'completed', 'rejected', 'cancelled')),
  admin_notes text,
  processed_by uuid references auth.users(id),
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Token Sale Settings (Admin configurable)
create table if not exists public.token_sale_settings (
  id uuid primary key default gen_random_uuid(),
  exchange_rate numeric(10, 4) not null default 100.0, -- tokens per dollar (default: 100 tokens = $1)
  min_sale_amount bigint not null default 100, -- minimum tokens to sell
  max_sale_amount bigint, -- null = unlimited
  is_enabled boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

-- Insert default settings
insert into public.token_sale_settings (id, exchange_rate, min_sale_amount, is_enabled)
values (gen_random_uuid(), 100.0, 100, true)
on conflict do nothing;

-- Indexes
create index if not exists token_sales_user_idx on public.token_sales(user_id, created_at desc);
create index if not exists token_sales_status_idx on public.token_sales(status);

-- RLS Policies
alter table public.token_sales enable row level security;
alter table public.token_sale_settings enable row level security;

-- Users can read their own sales
create policy "users_read_own_sales"
on public.token_sales for select to authenticated
using (auth.uid() = user_id);

-- Users can create their own sales
create policy "users_create_own_sales"
on public.token_sales for insert to authenticated
with check (auth.uid() = user_id);

-- Users can update their own pending sales (cancel)
create policy "users_update_own_pending_sales"
on public.token_sales for update to authenticated
using (auth.uid() = user_id and status = 'pending')
with check (auth.uid() = user_id);

-- Public can read sale settings
create policy "public_read_sale_settings"
on public.token_sale_settings for select to anon
using (is_enabled = true);

-- Admins can manage all sales (will need service role or admin check)
-- Note: Admin policies should be added separately based on your admin system
