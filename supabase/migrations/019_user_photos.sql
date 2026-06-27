
-- Create user_photos table to store user photo gallery entries
create table if not exists user_photos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  public_url text not null,
  public_id text not null,
  caption text,
  created_at timestamptz default now()
);

create index if not exists idx_user_photos_user_id on user_photos(user_id);
