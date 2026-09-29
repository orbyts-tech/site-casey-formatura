-- Invitations: one personalized link per family/person, answered through the guest cookie.
create table if not exists public.invitations (
  id uuid primary key,
  token text not null unique check (token ~ '^[A-Za-z0-9_-]{22}$'),
  greeting_prefix text not null check (greeting_prefix in ('Querida', 'Querido', 'Queridas', 'Queridos', 'Olá')),
  greeting_name text not null check (char_length(greeting_name) between 2 and 80),
  guest_names text[] not null default '{}' check (cardinality(guest_names) <= 12),
  rsvp_status text not null default 'pending' check (rsvp_status in ('pending', 'confirmed', 'deferred')),
  responded_at timestamptz,
  opened_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists invitations_created_at_idx on public.invitations (created_at desc);

-- Gift catalog managed by Casey in the admin panel.
create table if not exists public.gifts (
  id text primary key check (char_length(id) between 1 and 64),
  name text not null check (char_length(name) between 2 and 80),
  description text not null check (char_length(description) between 4 and 240),
  price_in_cents integer not null check (price_in_cents between 100 and 10000000),
  image_url text not null check (char_length(image_url) <= 1024),
  image_alt text not null check (char_length(image_alt) <= 160),
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists gifts_sort_order_idx on public.gifts (sort_order, created_at);

insert into public.gifts (id, name, description, price_in_cents, image_url, image_alt, sort_order) values
  ('livros-novos-olhares', 'Livros para novos olhares', 'Leituras que vão acompanhar os primeiros passos na profissão.', 8000, '/images/presentes/livros.png', 'Pilha de livros de psicologia com óculos dourados por cima', 1),
  ('cafes-entre-conquistas', 'Cafés entre conquistas', 'Para os cafés que vêm antes (e depois) de cada atendimento.', 5000, '/images/presentes/cafes.png', 'Duas canecas de cerâmica creme com folhas verdes pintadas', 2),
  ('primeiro-consultorio', 'Meu primeiro consultório', 'Um cantinho acolhedor para receber cada história.', 30000, '/images/presentes/consultorio.png', 'Poltrona verde-sálvia com pés de madeira ao lado de uma oliveira', 3),
  ('pausa-para-mim', 'Uma pausa para mim', 'Porque cuidar de quem cuida também faz parte.', 15000, '/images/presentes/pausa.png', 'Vela acesa ao lado de um roupão branco macio', 4),
  ('novos-planos-no-papel', 'Novos planos no papel', 'Um planner para sonhar, planejar e conquistar.', 10000, '/images/presentes/planner.png', 'Caderno verde-escuro com folha dourada e caneta dourada', 5),
  ('nova-aventura', 'Uma nova aventura', 'Para a viagem que vai celebrar esse novo capítulo.', 20000, '/images/presentes/viagem.png', 'Mala de viagem verde-sálvia ao lado de uma pequena oliveira', 6)
on conflict (id) do nothing;

-- Links each contribution to the invitation that opened the site, when there is one.
alter table public.gift_contributions
  add column if not exists invitation_id uuid references public.invitations (id) on delete set null;

create index if not exists gift_contributions_invitation_id_idx on public.gift_contributions (invitation_id);

-- Access happens only through validated Server Actions using the service role.
-- RLS without policies denies every request made with the anon/authenticated keys.
alter table public.invitations enable row level security;
alter table public.invitations force row level security;
revoke all on table public.invitations from anon, authenticated;

alter table public.gifts enable row level security;
alter table public.gifts force row level security;
revoke all on table public.gifts from anon, authenticated;

-- Public bucket for gift photos: anyone can read, only the service role uploads.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('gift-images', 'gift-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
