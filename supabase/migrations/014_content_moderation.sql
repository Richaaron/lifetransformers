-- Content Moderation: Reports table
create table reports (
  id uuid default gen_random_uuid() primary key,
  reporter_id uuid references profiles(id) on delete cascade not null,
  resource_type text not null, -- 'post' | 'comment' | 'message' | 'profile'
  resource_id uuid not null,
  reason text not null,
  description text,
  status text default 'pending', -- 'pending' | 'reviewed' | 'dismissed' | 'actioned'
  reviewed_by uuid references profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz default now()
);

-- RLS for reports
alter table reports enable row level security;

create policy "Users can view their own reports"
  on reports for select
  using (auth.uid() = reporter_id);

create policy "Users can create reports"
  on reports for insert
  with check (auth.uid() = reporter_id);

-- Indexes for reports
create index idx_reports_reporter_id on reports(reporter_id);
create index idx_reports_status on reports(status);
create index idx_reports_resource on reports(resource_type, resource_id);
