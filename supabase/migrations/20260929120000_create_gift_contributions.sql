create table if not exists public.gift_contributions (
  id uuid primary key,
  giver_name text not null check (char_length(giver_name) between 2 and 80),
  message text check (message is null or char_length(message) <= 500),
  items jsonb not null check (jsonb_typeof(items) = 'array' and jsonb_array_length(items) > 0),
  total_in_cents integer not null check (total_in_cents > 0),
  pix_txid text not null unique check (char_length(pix_txid) <= 25),
  status text not null default 'awaiting_payment'
    check (status in ('awaiting_payment', 'reported_paid', 'confirmed', 'cancelled')),
  reported_paid_at timestamptz,
  confirmed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists gift_contributions_created_at_idx
  on public.gift_contributions (created_at desc);

-- Access happens only through validated Server Actions using the service role.
-- RLS without policies denies every request made with the anon/authenticated keys.
alter table public.gift_contributions enable row level security;
alter table public.gift_contributions force row level security;
revoke all on table public.gift_contributions from anon, authenticated;
