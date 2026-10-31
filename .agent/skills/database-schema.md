# Skill: Supabase Schema & Data Model

Use this SQL schema in the Supabase SQL Editor to set up persistence. Because the AI generates deeply nested event plans that users frequently toggle and edit in real time, storing the core metadata in columns and the dynamic arrays (`budget_breakdown`, `timeline`, `vendor_checklist`, `personalized_ideas`) as `JSONB` columns avoids complex 5-table joins and makes vibe coding 10x faster and bug-free.

## Supabase SQL Script
```sql
create table public.events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade null,
  event_type text not null, -- 'wedding' | 'birthday' | 'community'
  event_name text not null,
  event_date date,
  location text,
  guest_count integer default 50,
  total_budget numeric default 5000,
  currency text default 'USD',
  vibe text,
  summary text,
  budget_breakdown jsonb default '[]'::jsonb,
  timeline jsonb default '[]'::jsonb,
  vendor_checklist jsonb default '[]'::jsonb,
  personalized_ideas jsonb default '[]'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.events enable row level security;

-- Allow public/anon read & write for demo simplicity, or scope to auth.uid()
create policy "Allow all operations for authenticated and demo users"
  on public.events for all
  using (true)
  with check (true);