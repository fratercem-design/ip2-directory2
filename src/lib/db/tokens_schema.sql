-- Token System Schema for Cult of Psyche

-- User Token Balances
create table if not exists public.user_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  balance bigint not null default 0,
  total_earned bigint not null default 0,
  total_spent bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

-- Token Transactions (Audit Log)
create table if not exists public.token_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount bigint not null, -- Positive for earned, negative for spent
  transaction_type text not null check (transaction_type in (
    'earn_watch_stream',
    'earn_daily_login',
    'earn_follow_streamer',
    'earn_create_clip',
    'earn_share_content',
    'earn_ritual_attendance',
    'earn_community_contribution',
    'spend_reward',
    'spend_feature',
    'admin_adjustment',
    'transfer'
  )),
  description text,
  metadata jsonb not null default '{}'::jsonb, -- Store related IDs, details, etc.
  created_at timestamptz not null default now()
);

-- Token Rewards/Shop (Optional - for spending tokens)
create table if not exists public.token_rewards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  cost bigint not null,
  reward_type text not null check (reward_type in ('badge', 'title', 'feature', 'physical', 'digital')),
  reward_data jsonb not null default '{}'::jsonb, -- What they actually get
  is_active boolean not null default true,
  stock_limit int, -- null = unlimited
  stock_remaining int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- User Rewards (What users have purchased/earned)
create table if not exists public.user_rewards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  reward_id uuid not null references public.token_rewards(id) on delete cascade,
  purchased_at timestamptz not null default now(),
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb
);

-- Indexes
create index if not exists user_tokens_user_idx on public.user_tokens(user_id);
create index if not exists token_transactions_user_idx on public.token_transactions(user_id, created_at desc);
create index if not exists token_transactions_type_idx on public.token_transactions(transaction_type);
create index if not exists user_rewards_user_idx on public.user_rewards(user_id);

-- RLS Policies
alter table public.user_tokens enable row level security;
alter table public.token_transactions enable row level security;
alter table public.token_rewards enable row level security;
alter table public.user_rewards enable row level security;

-- Users can read their own token balance
create policy "users_read_own_tokens"
on public.user_tokens for select to authenticated
using (auth.uid() = user_id);

-- Users can read their own transactions
create policy "users_read_own_transactions"
on public.token_transactions for select to authenticated
using (auth.uid() = user_id);

-- Public can read active rewards
create policy "public_read_active_rewards"
on public.token_rewards for select to anon
using (is_active = true);

-- Users can read their own rewards
create policy "users_read_own_rewards"
on public.user_rewards for select to authenticated
using (auth.uid() = user_id);

-- Function to update token balance (called via trigger)
create or replace function update_user_token_balance()
returns trigger as $$
begin
  update public.user_tokens
  set
    balance = balance + new.amount,
    total_earned = total_earned + case when new.amount > 0 then new.amount else 0 end,
    total_spent = total_spent + case when new.amount < 0 then abs(new.amount) else 0 end,
    updated_at = now()
  where user_id = new.user_id;
  
  -- Create balance record if it doesn't exist
  insert into public.user_tokens (user_id, balance, total_earned, total_spent)
  values (new.user_id, new.amount, 
    case when new.amount > 0 then new.amount else 0 end,
    case when new.amount < 0 then abs(new.amount) else 0 end)
  on conflict (user_id) do nothing;
  
  return new;
end;
$$ language plpgsql;

-- Trigger to auto-update balance on transaction
create trigger token_balance_update
after insert on public.token_transactions
for each row execute function update_user_token_balance();
