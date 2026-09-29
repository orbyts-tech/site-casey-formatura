-- Rate limiting shared by every serverless instance. Keys are HMACs, never raw IPs or e-mails.
create table if not exists public.rate_limit_hits (
  bucket_key text primary key check (char_length(bucket_key) <= 128),
  hit_count integer not null check (hit_count > 0),
  window_started_at timestamptz not null default now()
);

create index if not exists rate_limit_hits_window_started_at_idx on public.rate_limit_hits (window_started_at);

alter table public.rate_limit_hits enable row level security;
alter table public.rate_limit_hits force row level security;
revoke all on table public.rate_limit_hits from anon, authenticated;

create or replace function public.consume_rate_limit(p_bucket_key text, p_max_hits integer, p_window_seconds integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_hit_count integer;
begin
  insert into public.rate_limit_hits as hits (bucket_key, hit_count, window_started_at)
  values (p_bucket_key, 1, now())
  on conflict (bucket_key) do update
    set hit_count = case
          when hits.window_started_at < now() - make_interval(secs => p_window_seconds) then 1
          else hits.hit_count + 1
        end,
        window_started_at = case
          when hits.window_started_at < now() - make_interval(secs => p_window_seconds) then now()
          else hits.window_started_at
        end
  returning hit_count into current_hit_count;

  if random() < 0.01 then
    delete from public.rate_limit_hits where window_started_at < now() - interval '1 day';
  end if;

  return current_hit_count <= p_max_hits;
end;
$$;

revoke all on function public.consume_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_rate_limit(text, integer, integer) to service_role;
