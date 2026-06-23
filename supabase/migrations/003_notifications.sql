-- Add RLS to notifications
alter table public.notifications enable row level security;

create policy "Users can view their own notifications"
on public.notifications for select
using (auth.uid() = user_id);

create policy "Users can update their own notifications"
on public.notifications for update
using (auth.uid() = user_id);

create policy "Users can delete their own notifications"
on public.notifications for delete
using (auth.uid() = user_id);

-- Enable Realtime for notifications
alter publication supabase_realtime add table notifications;

-- Configure Replica Identity so Realtime gets full payload
alter table public.notifications replica identity full;

-- Trigger: Notify on new comment
create or replace function notify_on_comment()
returns trigger as $$
declare
  post_author_id uuid;
begin
  -- Get the author of the post being commented on
  select author_id into post_author_id
  from public.posts
  where id = new.post_id;

  -- Only notify if the commenter is not the post author
  if post_author_id is not null and post_author_id != new.author_id then
    insert into public.notifications (user_id, type, actor_id, resource_id, resource_type)
    values (post_author_id, 'comment', new.author_id, new.post_id, 'post');
  end if;

  return new;
end;
$$ language plpgsql security definer;

create trigger on_comment_created
  after insert on public.comments
  for each row execute procedure notify_on_comment();

-- Trigger: Notify on new message
create or replace function notify_on_message()
returns trigger as $$
declare
  recipient_record record;
begin
  -- Find all other participants in the conversation
  for recipient_record in
    select user_id
    from public.conversation_participants
    where conversation_id = new.conversation_id
      and user_id != new.sender_id
  loop
    insert into public.notifications (user_id, type, actor_id, resource_id, resource_type)
    values (recipient_record.user_id, 'message', new.sender_id, new.conversation_id, 'conversation');
  end loop;

  return new;
end;
$$ language plpgsql security definer;

create trigger on_message_created
  after insert on public.messages
  for each row execute procedure notify_on_message();
