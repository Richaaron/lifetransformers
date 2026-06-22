-- Add message_type to messages table (text, voice, image)
alter table messages add column message_type text default 'text' not null;
alter table messages add column audio_url text;

-- Call logs table
create table call_logs (
  id uuid default gen_random_uuid() primary key,
  caller_id uuid references profiles(id) on delete cascade not null,
  receiver_id uuid references profiles(id) on delete cascade not null,
  status text not null default 'missed', -- 'missed', 'answered', 'declined', 'completed'
  call_type text not null default 'voice', -- 'voice', 'video'
  started_at timestamptz default now(),
  ended_at timestamptz,
  duration_seconds integer default 0
);

-- RLS for call_logs
alter table call_logs enable row level security;

create policy "Users can view their own calls"
  on call_logs for select
  using (auth.uid() = caller_id or auth.uid() = receiver_id);

create policy "Users can insert calls"
  on call_logs for insert
  with check (auth.uid() = caller_id);

create policy "Users can update their own calls"
  on call_logs for update
  using (auth.uid() = caller_id or auth.uid() = receiver_id);

-- Function to increment posts_count
create or replace function public.increment_posts_count()
returns trigger as $$
begin
  update user_progress 
  set posts_count = posts_count + 1, updated_at = now()
  where user_id = NEW.author_id;
  return NEW;
end;
$$ language plpgsql security definer;

create trigger on_post_created
  after insert on posts
  for each row execute procedure public.increment_posts_count();

-- Function to increment comments_count
create or replace function public.increment_comments_count()
returns trigger as $$
begin
  update user_progress 
  set comments_count = comments_count + 1, updated_at = now()
  where user_id = NEW.author_id;
  return NEW;
end;
$$ language plpgsql security definer;

create trigger on_comment_created
  after insert on comments
  for each row execute procedure public.increment_comments_count();
