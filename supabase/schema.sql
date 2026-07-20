-- Run this once in your Supabase project's SQL editor.
-- Dashboard -> SQL Editor -> New query -> paste this -> Run.

create table if not exists public.sets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise text not null,
  weight numeric not null,
  unit text not null default 'kg' check (unit in ('kg', 'lb')),
  reps int not null,
  performed_at date not null default current_date,
  created_at timestamptz not null default now()
);

alter table public.sets enable row level security;

-- Each user can only ever see, insert, update, or delete their own rows.
create policy "Users can view their own sets"
  on public.sets for select
  using (auth.uid() = user_id);

create policy "Users can insert their own sets"
  on public.sets for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own sets"
  on public.sets for update
  using (auth.uid() = user_id);

create policy "Users can delete their own sets"
  on public.sets for delete
  using (auth.uid() = user_id);

create index if not exists sets_user_exercise_idx on public.sets (user_id, exercise, performed_at);
