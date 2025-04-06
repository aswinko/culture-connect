<!-- category table -->

create table categories (
  id uuid default gen_random_uuid() primary key,
  name text unique not null check (char_length(name) >= 3),
  created_at timestamp default now() not null
);

<!-- event table -->
create table events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null check (char_length(name) >= 3),
  price numeric(10,2) not null check (price >= 0),
  description text not null check (char_length(description) >= 10),
  image text not null,
  category_id uuid references categories(id) on delete cascade not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp default now() not null
);


CREATE TABLE public.bids (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  bid_amount numeric(10, 2) NOT NULL,
  created_at timestamp DEFAULT now()
);
