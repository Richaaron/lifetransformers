-- USER PROGRESS (XP and level tracking)
create table user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade unique not null,
  xp integer default 0 not null,
  level integer default 1 not null,
  posts_count integer default 0 not null,
  comments_count integer default 0 not null,
  likes_received integer default 0 not null,
  updated_at timestamptz default now() not null,
  created_at timestamptz default now() not null
);

-- XP LOG (audit trail for all XP changes)
create table xp_log (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  amount integer not null,
  reason text not null, -- 'post_created', 'comment_created', 'like_received'
  reference_id uuid, -- post_id or comment_id
  created_at timestamptz default now() not null
);

-- RLS policies for user_progress
alter table user_progress enable row level security;

create policy "User progress is viewable by everyone"
  on user_progress for select
  using (true);

create policy "System can insert user progress"
  on user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own progress"
  on user_progress for update
  using (auth.uid() = user_id);

-- RLS policies for xp_log
alter table xp_log enable row level security;

create policy "Users can view their own XP log"
  on xp_log for select
  using (auth.uid() = user_id);

create policy "System can insert XP log"
  on xp_log for insert
  with check (true);

-- Function to add XP and update level
create or replace function public.add_xp(
  p_user_id uuid,
  p_amount integer,
  p_reason text,
  p_reference_id uuid default null
)
returns void as $$
declare
  new_xp integer;
  new_level integer;
begin
  -- Insert XP log entry
  insert into xp_log (user_id, amount, reason, reference_id)
  values (p_user_id, p_amount, p_reason, p_reference_id);

  -- Upsert user_progress
  insert into user_progress (user_id, xp, level, updated_at)
  values (p_user_id, p_amount, 1, now())
  on conflict (user_id) do update
  set xp = user_progress.xp + p_amount,
      updated_at = now();

  -- Get new XP total
  select xp into new_xp from user_progress where user_id = p_user_id;

  -- Calculate level based on XP thresholds (exponential curve)
  -- Level 1: 0 XP (Follower)
  -- Level 2: 50 XP (Believer)
  -- Level 3: 150 XP (Disciple)
  -- Level 4: 350 XP (Witness)
  -- Level 5: 700 XP (Minister)
  -- Level 6: 1200 XP (Elder)
  -- Level 7: 2000 XP (Deacon)
  -- Level 8: 3200 XP (Pastor)
  -- Level 9: 5000 XP (Bishop)
  -- Level 10: 8000 XP (Apostle)
  -- Level 11: 12500 XP (Prophet)
  -- Level 12: 20000 XP (Saint)
  new_level := case
    when new_xp >= 20000 then 12
    when new_xp >= 12500 then 11
    when new_xp >= 8000 then 10
    when new_xp >= 5000 then 9
    when new_xp >= 3200 then 8
    when new_xp >= 2000 then 7
    when new_xp >= 1200 then 6
    when new_xp >= 700 then 5
    when new_xp >= 350 then 4
    when new_xp >= 150 then 3
    when new_xp >= 50 then 2
    else 1
  end;

  -- Update level if it changed
  update user_progress set level = new_level where user_id = p_user_id;
end;
$$ language plpgsql security definer;

-- Function to handle new user creation (initialize progress)
create or replace function public.handle_new_user_progress()
returns trigger as $$
begin
  insert into public.user_progress (user_id, xp, level)
  values (new.id, 0, 1);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created_progress
  after insert on auth.users
  for each row execute procedure public.handle_new_user_progress();
