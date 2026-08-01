-- UzbekCraft Supabase Cloud Save Database Setup Script
-- Paste and execute this script inside the SQL Editor of your Supabase Dashboard.

create table public.uzbekcraft_saves (
  id text primary key,
  name text not null,
  map text not null,
  timestamp bigint not null,
  player_pos jsonb not null,
  yaw double precision not null,
  pitch double precision not null,
  day_time double precision not null,
  hotbar_blocks jsonb not null,
  skin text not null,
  modified_blocks jsonb not null,
  quest_state text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) and allow public read/write access.
alter table public.uzbekcraft_saves enable row level security;

create policy "Allow public read/write access" on public.uzbekcraft_saves
  for all using (true) with check (true);
