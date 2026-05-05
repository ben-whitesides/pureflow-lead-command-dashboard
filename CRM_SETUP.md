# PureFlow CRM Mode Setup

The dashboard now has a local CRM mode that works immediately in the browser:

- Lead status
- Assigned rep
- Follow-up date
- Notes per lead
- CRM notes CSV export
- Twenty CRM import CSV export

Local CRM data is saved in the browser's local storage. It is good for testing and single-device use, but it is not shared across reps.

## Team Sync Setup

To make notes/status shared across the sales team, create a free Supabase project and provide:

- Supabase project URL
- Supabase anon public key
- Sales rep emails that should have access

Do not share the service-role key in the browser.

## Suggested Supabase Schema

```sql
create table lead_status (
  lead_id text primary key,
  status text not null default 'Not Contacted',
  owner text,
  follow_up date,
  updated_by uuid,
  updated_at timestamptz not null default now()
);

create table lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id text not null,
  note text not null,
  created_by uuid,
  created_at timestamptz not null default now()
);

alter table lead_status enable row level security;
alter table lead_notes enable row level security;

create policy "authenticated users can read lead status"
on lead_status for select
to authenticated
using (true);

create policy "authenticated users can upsert lead status"
on lead_status for all
to authenticated
using (true)
with check (true);

create policy "authenticated users can read notes"
on lead_notes for select
to authenticated
using (true);

create policy "authenticated users can add notes"
on lead_notes for insert
to authenticated
with check (true);
```

## Twenty CRM Import

Use the dashboard's `Twenty import CSV` button from CRM Mode. Import the CSV into Twenty as companies/leads and map custom fields such as:

- Lead Score
- Priority Tier
- Financial Quality Tier
- Recommended Terms
- Sales Segment
- CRM Status
- Assigned Owner
- Follow Up Date
