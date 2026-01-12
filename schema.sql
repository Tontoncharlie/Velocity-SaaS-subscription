-- Create profiles table
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  phone text,
  plan text default 'Free Tier',
  status text default 'Active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Set up Realtime
alter publication supabase_realtime add table profiles;
