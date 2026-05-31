-- ============================================================
-- 3B Media Group — COMPLETE DEPLOYMENT MIGRATION
-- Run this ONCE on a fresh Supabase project (SQL Editor → New query)
-- Last updated: 2026-05-30
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES (auth users → roles)
-- ============================================================
create table if not exists media_profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  role         text not null default 'client' check (role in ('owner','admin','client','vendor')),
  is_admin     boolean not null default false,
  full_name    text,
  avatar_url   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Auto-create profile on user signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into media_profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============================================================
-- LEADS
-- ============================================================
create table if not exists media_leads (
  id                  uuid primary key default uuid_generate_v4(),
  name                text not null,
  email               text not null,
  phone               text,
  company_name        text,
  service_interest    text,
  message             text,
  source              text not null default 'website',
  lead_type           text,
  status              text not null default 'new'
                        check (status in ('new','contacted','qualified','proposal_sent','won','lost')),
  priority            text check (priority in ('low','medium','high','urgent')),
  admin_notes         text,
  converted_at        timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists media_leads_status_idx  on media_leads(status);
create index if not exists media_leads_email_idx   on media_leads(email);
create index if not exists media_leads_created_idx on media_leads(created_at desc);

-- ============================================================
-- CLIENTS (converted leads / portal users)
-- ============================================================
create table if not exists media_clients (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid references auth.users(id) on delete set null,
  lead_id             uuid references media_leads(id) on delete set null,
  full_name           text not null,
  email               text not null unique,
  phone               text,
  company_name        text,
  status              text not null default 'active'
                        check (status in ('active','inactive','pending','churned')),
  billing_status      text not null default 'pending'
                        check (billing_status in ('pending','current','overdue','cancelled')),
  has_listing_access  boolean not null default false,
  notes               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists media_clients_email_idx on media_clients(email);

-- ============================================================
-- CUSTOMERS (Stripe checkout identity — email → stripe_customer_id)
-- ============================================================
create table if not exists media_customers (
  id                 uuid primary key default uuid_generate_v4(),
  user_id            uuid references auth.users(id) on delete set null,
  full_name          text,
  email              text not null unique,
  phone              text,
  company_name       text,
  stripe_customer_id text unique,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- ============================================================
-- SERVICE PACKAGES
-- ============================================================
create table if not exists media_service_packages (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  slug            text not null unique,
  description     text,
  price_cents     integer,
  price_display   text,
  billing_period  text check (billing_period in ('one_time','monthly','annual')),
  category        text,
  is_public       boolean not null default true,
  is_featured     boolean not null default false,
  is_recurring    boolean not null default false,
  stripe_price_id text,
  stripe_product_id text,
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now()
);

insert into media_service_packages
  (name, slug, description, price_cents, price_display, billing_period, is_recurring, category, is_public, is_featured, sort_order)
values
  ('Starter',              'starter',             '4 social posts, AI graphics, captions',                     9900,  '$99/mo',  'monthly',  true,  'marketing', true,  false, 1),
  ('Growth',               'growth',              '8 posts, 2 reels, content calendar, open house promo',      19900, '$199/mo', 'monthly',  true,  'marketing', true,  true,  2),
  ('Business Pro',         'business-pro',        '12 posts, 4 reels, marketing support, priority turnaround', 34900, '$349/mo', 'monthly',  true,  'marketing', true,  false, 3),
  ('Starter Website',      'website-starter',     'Clean one-page presence to get online fast',                29900, '$299',    'one_time', false, 'website',   true,  false, 4),
  ('Business Website',     'website-business',    'Multi-page site built to convert',                          59900, '$599',    'one_time', false, 'website',   true,  false, 5),
  ('Professional Website', 'website-pro',         'Premium build with advanced features and integrations',     99900, '$999+',   'one_time', false, 'website',   true,  false, 6),
  ('Open House Blast',     'open-house-blast',    'Targeted open house marketing campaign',                     2900, '$29',     'one_time', false, 'realtor',   true,  false, 7),
  ('Listing Marketing',    'listing-marketing',   'Full listing marketing package',                             4900, '$49',     'one_time', false, 'realtor',   true,  false, 8),
  ('Realtor Marketing',    'realtor-marketing',   'Monthly realtor social media + listing content package',    14900, '$149/mo', 'monthly',  true,  'realtor',   true,  true,  9),
  ('Reel Creation',        'reel-creation',       'Professional short-form video reel',                         2500, '$25',     'one_time', false, 'creative',  true,  false, 10)
on conflict (slug) do nothing;

-- ============================================================
-- ORDERS (Stripe checkout — column names match app code)
-- ============================================================
create table if not exists media_orders (
  id                        uuid primary key default uuid_generate_v4(),
  customer_id               uuid references media_customers(id) on delete set null,
  client_id                 uuid references media_clients(id) on delete set null,
  package_id                uuid references media_service_packages(id) on delete set null,
  stripe_session_id         text unique,
  stripe_payment_intent_id  text,         -- matches webhook + payment_intent.succeeded handler
  stripe_subscription_id    text,         -- matches customer.subscription.deleted handler
  stripe_customer_id        text,
  amount                    integer,      -- cents
  currency                  text default 'usd',
  payment_status            text not null default 'pending'
                              check (payment_status in ('pending','paid','failed','refunded')),
  fulfillment_status        text not null default 'pending'
                              check (fulfillment_status in ('pending','intake_sent','intake_received','in_progress','delivered','cancelled')),
  metadata                  jsonb default '{}',
  notes                     text,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

create index if not exists media_orders_customer_idx      on media_orders(customer_id);
create index if not exists media_orders_client_idx        on media_orders(client_id);
create index if not exists media_orders_package_idx       on media_orders(package_id);
create index if not exists media_orders_payment_idx       on media_orders(payment_status);
create index if not exists media_orders_subscription_idx  on media_orders(stripe_subscription_id);
create index if not exists media_orders_session_idx       on media_orders(stripe_session_id);

-- ============================================================
-- PROJECTS
-- ============================================================
create table if not exists media_projects (
  id              uuid primary key default uuid_generate_v4(),
  client_id       uuid references media_clients(id) on delete cascade,
  customer_id     uuid references media_customers(id) on delete set null,
  order_id        uuid references media_orders(id) on delete set null,
  title           text not null,
  project_type    text not null
                    check (project_type in ('website','marketing','ai_setup','creative','open_house','reel','branding','other')),
  status          text not null default 'not_started'
                    check (status in ('not_started','in_progress','waiting_on_client','review','completed','cancelled')),
  description     text,
  notes           text,
  deadline        date,
  delivered_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists media_projects_client_idx on media_projects(client_id);
create index if not exists media_projects_status_idx on media_projects(status);

-- Legacy project tables (kept for compatibility)
create table if not exists media_website_projects (
  id          uuid primary key default uuid_generate_v4(),
  customer_id uuid references media_customers(id) on delete set null,
  status      text not null default 'new',
  live_url    text,
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists media_logo_projects (
  id                  uuid primary key default uuid_generate_v4(),
  customer_id         uuid references media_customers(id) on delete set null,
  status              text not null default 'new',
  revisions_included  integer not null default 2,
  revisions_used      integer not null default 0,
  notes               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create table if not exists media_domain_requests (
  id          uuid primary key default uuid_generate_v4(),
  customer_id uuid references media_customers(id) on delete set null,
  client_id   uuid references media_clients(id) on delete set null,
  domain_name text,
  status      text not null default 'pending',
  created_at  timestamptz not null default now()
);

-- ============================================================
-- CONTENT REQUESTS (general client submissions)
-- ============================================================
create table if not exists media_content_requests (
  id           uuid primary key default uuid_generate_v4(),
  client_id    uuid references media_clients(id) on delete cascade,
  service_type text,
  description  text,
  deadline     date,
  file_urls    text[],
  notes        text,
  status       text not null default 'pending'
                 check (status in ('pending','in_review','approved','rejected','completed')),
  admin_notes  text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ============================================================
-- PORTFOLIO & TESTIMONIALS
-- ============================================================
create table if not exists media_portfolio_clients (
  id           uuid primary key default uuid_generate_v4(),
  slug         text not null unique,
  name         text not null,
  industry     text,
  summary      text,
  results      jsonb,
  before_url   text,
  after_url    text,
  is_published boolean not null default false,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

create table if not exists media_testimonials (
  id           uuid primary key default uuid_generate_v4(),
  client_id    uuid references media_clients(id) on delete set null,
  author_name  text not null,
  author_title text,
  quote        text not null,
  rating       integer check (rating between 1 and 5),
  is_published boolean not null default false,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

insert into media_testimonials (author_name, author_title, quote, rating, is_published, sort_order)
values (
  'Madalyn',
  'Real Estate Professional',
  '3B Media Group built my entire online presence and kept my listings in front of buyers every week. It changed how my business looks.',
  5, true, 1
) on conflict do nothing;

-- ============================================================
-- GROWTH WIZARD & ECOSYSTEM
-- ============================================================
create table if not exists media_growth_wizard_submissions (
  id                    uuid primary key default uuid_generate_v4(),
  lead_id               uuid references media_leads(id) on delete set null,
  name                  text,
  email                 text,
  phone                 text,
  business_name         text,
  industry              text,
  years_in_business     text,
  employee_count        text,
  annual_revenue_range  text,
  has_website           boolean,
  has_social            boolean,
  runs_ads              boolean,
  collects_leads        boolean,
  growth_goals          text[],
  challenges            text[],
  recommendations       jsonb,
  source                text default 'growth_wizard',
  status                text not null default 'new',
  raw_responses         jsonb,
  created_at            timestamptz not null default now()
);

create table if not exists media_ecosystem_referrals (
  id                    uuid primary key default uuid_generate_v4(),
  lead_id               uuid references media_leads(id) on delete cascade,
  wizard_submission_id  uuid references media_growth_wizard_submissions(id) on delete cascade,
  ecosystem_product     text not null,
  source_feature        text,
  reason                text,
  status                text not null default 'recommended',
  created_at            timestamptz not null default now()
);

-- ============================================================
-- ANALYTICS & EMAIL EVENTS
-- ============================================================
create table if not exists media_analytics_events (
  id         uuid primary key default uuid_generate_v4(),
  event_name text not null,
  lead_id    uuid references media_leads(id) on delete set null,
  user_id    uuid references auth.users(id) on delete set null,
  properties jsonb,
  created_at timestamptz not null default now()
);

create index if not exists media_analytics_name_idx on media_analytics_events(event_name);

create table if not exists media_email_events (
  id          uuid primary key default uuid_generate_v4(),
  lead_id     uuid references media_leads(id) on delete set null,
  to_email    text not null,
  template    text not null,
  status      text not null default 'queued'
                check (status in ('queued','sent','failed','opened','clicked')),
  entity_type text,
  entity_id   uuid,
  sent_at     timestamptz,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- ACTIVITY LOG (webhook events, admin actions)
-- ============================================================
create table if not exists media_activity_log (
  id          uuid primary key default uuid_generate_v4(),
  entity_type text,
  entity_id   uuid,
  action      text not null,
  actor       text,
  details     jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists media_activity_log_entity_idx on media_activity_log(entity_type, entity_id);

-- ============================================================
-- UPLOADED FILES
-- ============================================================
create table if not exists media_uploaded_files (
  id           uuid primary key default uuid_generate_v4(),
  client_id    uuid references media_clients(id) on delete cascade,
  project_id   uuid references media_projects(id) on delete set null,
  request_id   uuid references media_content_requests(id) on delete set null,
  storage_path text not null,
  file_name    text not null,
  file_size    integer,
  mime_type    text,
  uploaded_by  uuid references auth.users(id) on delete set null,
  created_at   timestamptz not null default now()
);

-- ============================================================
-- MARKETPLACE (foundation — no UI yet)
-- ============================================================
create table if not exists media_marketplace_vendors (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references auth.users(id) on delete set null,
  business_name   text not null,
  email           text not null,
  category        text,
  description     text,
  status          text not null default 'pending'
                    check (status in ('pending','approved','suspended','rejected')),
  commission_pct  numeric(5,2) default 10.00,
  created_at      timestamptz not null default now()
);

create table if not exists media_marketplace_services (
  id           uuid primary key default uuid_generate_v4(),
  vendor_id    uuid references media_marketplace_vendors(id) on delete cascade,
  title        text not null,
  description  text,
  category     text,
  price_cents  integer,
  price_display text,
  is_featured  boolean not null default false,
  is_active    boolean not null default false,
  created_at   timestamptz not null default now()
);

create table if not exists media_marketplace_orders (
  id               uuid primary key default uuid_generate_v4(),
  service_id       uuid references media_marketplace_services(id) on delete set null,
  client_id        uuid references media_clients(id) on delete set null,
  vendor_id        uuid references media_marketplace_vendors(id) on delete set null,
  amount_cents     integer,
  commission_cents integer,
  status           text not null default 'pending',
  created_at       timestamptz not null default now()
);

-- ============================================================
-- REAL ESTATE LISTINGS
-- ============================================================
create table if not exists media_property_listings (
  id                      uuid primary key default uuid_generate_v4(),
  client_id               uuid not null references media_clients(id) on delete cascade,

  -- Required fields
  property_address        text not null,
  listing_price           text not null,
  bedrooms                integer,
  bathrooms               numeric(3,1),
  square_footage          integer,
  listing_description     text,
  realtor_name            text not null,
  realtor_phone           text,
  realtor_email           text,

  -- Optional fields
  lot_size                text,
  mls_link                text,
  open_house_date         date,
  open_house_time         text,
  neighborhood_highlights text,
  school_area_notes       text,
  key_features            text[],
  preferred_tone          text,
  preferred_cta           text,
  special_instructions    text,

  -- Admin
  admin_notes             text,

  -- URL import
  source_url              text,
  imported_from           text,
  import_confirmed_permission boolean not null default false,
  imported_raw_data       jsonb,

  -- Status workflow
  status                  text not null default 'submitted'
                            check (status in (
                              'submitted','generating','generated',
                              'in_review','approved','revision_requested','completed'
                            )),

  -- Service context
  service_package_slug    text,
  order_id                uuid references media_orders(id) on delete set null,

  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index if not exists media_listings_client_idx on media_property_listings(client_id);
create index if not exists media_listings_status_idx on media_property_listings(status);

create table if not exists media_listing_photos (
  id           uuid primary key default uuid_generate_v4(),
  listing_id   uuid not null references media_property_listings(id) on delete cascade,
  storage_path text not null,
  public_url   text not null,
  category     text not null default 'other'
                 check (category in ('exterior','kitchen','living_room','bedroom','bathroom','backyard','other')),
  sort_order   integer not null default 0,
  uploaded_by  uuid references auth.users(id) on delete set null,
  created_at   timestamptz not null default now()
);

create index if not exists media_listing_photos_listing_idx on media_listing_photos(listing_id);

create table if not exists media_generated_marketing_assets (
  id                  uuid primary key default uuid_generate_v4(),
  listing_id          uuid not null references media_property_listings(id) on delete cascade,
  facebook_listing    text,
  facebook_open_house text,
  instagram_caption   text,
  reel_script         text,
  flyer_copy          text,
  hashtags            text,
  sms_copy            text,
  email_copy          text,
  model_used          text,
  generation_version  integer not null default 1,
  is_current          boolean not null default true,
  created_at          timestamptz not null default now()
);

create index if not exists media_generated_assets_listing_idx on media_generated_marketing_assets(listing_id);

create table if not exists media_listing_revision_requests (
  id             uuid primary key default uuid_generate_v4(),
  listing_id     uuid not null references media_property_listings(id) on delete cascade,
  asset_type     text,
  notes          text not null,
  status         text not null default 'pending'
                   check (status in ('pending','in_review','completed')),
  admin_response text,
  created_at     timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Profiles
alter table media_profiles enable row level security;
create policy "Users read own profile"
  on media_profiles for select using (auth.uid() = id);
create policy "Users update own profile"
  on media_profiles for update using (auth.uid() = id);
create policy "Admins read all profiles"
  on media_profiles for select
  using (exists (select 1 from media_profiles p where p.id = auth.uid() and p.is_admin = true));

-- Leads: admin-only (service role used from API routes)
alter table media_leads enable row level security;
create policy "Admins manage leads"
  on media_leads for all
  using (exists (select 1 from media_profiles p where p.id = auth.uid() and p.is_admin = true));

-- Clients
alter table media_clients enable row level security;
create policy "Admins manage clients"
  on media_clients for all
  using (exists (select 1 from media_profiles p where p.id = auth.uid() and p.is_admin = true));
create policy "Client reads own record"
  on media_clients for select
  using (user_id = auth.uid() or email = (select email from auth.users where id = auth.uid()));

-- Customers
alter table media_customers enable row level security;
create policy "Admins manage customers"
  on media_customers for all
  using (exists (select 1 from media_profiles p where p.id = auth.uid() and p.is_admin = true));

-- Service packages
alter table media_service_packages enable row level security;
create policy "Public reads packages"
  on media_service_packages for select using (is_public = true);
create policy "Admins manage packages"
  on media_service_packages for all
  using (exists (select 1 from media_profiles p where p.id = auth.uid() and p.is_admin = true));

-- Orders
alter table media_orders enable row level security;
create policy "Admins manage orders"
  on media_orders for all
  using (exists (select 1 from media_profiles p where p.id = auth.uid() and p.is_admin = true));
create policy "Clients read own orders"
  on media_orders for select
  using (client_id in (
    select id from media_clients
    where email = (select email from auth.users where id = auth.uid())
  ));

-- Projects
alter table media_projects enable row level security;
create policy "Admins manage projects"
  on media_projects for all
  using (exists (select 1 from media_profiles p where p.id = auth.uid() and p.is_admin = true));
create policy "Clients read own projects"
  on media_projects for select
  using (client_id in (
    select id from media_clients
    where email = (select email from auth.users where id = auth.uid())
  ));

-- Content requests
alter table media_content_requests enable row level security;
create policy "Admins manage content requests"
  on media_content_requests for all
  using (exists (select 1 from media_profiles p where p.id = auth.uid() and p.is_admin = true));
create policy "Clients manage own requests"
  on media_content_requests for all
  using (client_id in (
    select id from media_clients
    where email = (select email from auth.users where id = auth.uid())
  ));

-- Portfolio & testimonials
alter table media_portfolio_clients enable row level security;
create policy "Public reads published portfolio"
  on media_portfolio_clients for select using (is_published = true);
create policy "Admins manage portfolio"
  on media_portfolio_clients for all
  using (exists (select 1 from media_profiles p where p.id = auth.uid() and p.is_admin = true));

alter table media_testimonials enable row level security;
create policy "Public reads published testimonials"
  on media_testimonials for select using (is_published = true);
create policy "Admins manage testimonials"
  on media_testimonials for all
  using (exists (select 1 from media_profiles p where p.id = auth.uid() and p.is_admin = true));

-- Uploaded files
alter table media_uploaded_files enable row level security;
create policy "Admins manage files"
  on media_uploaded_files for all
  using (exists (select 1 from media_profiles p where p.id = auth.uid() and p.is_admin = true));
create policy "Clients manage own files"
  on media_uploaded_files for all
  using (client_id in (
    select id from media_clients
    where email = (select email from auth.users where id = auth.uid())
  ));

-- Marketplace
alter table media_marketplace_vendors enable row level security;
create policy "Admins manage vendors"
  on media_marketplace_vendors for all
  using (exists (select 1 from media_profiles p where p.id = auth.uid() and p.is_admin = true));
create policy "Vendors read own record"
  on media_marketplace_vendors for select using (user_id = auth.uid());

alter table media_marketplace_services enable row level security;
create policy "Public reads active services"
  on media_marketplace_services for select using (is_active = true);
create policy "Admins manage marketplace services"
  on media_marketplace_services for all
  using (exists (select 1 from media_profiles p where p.id = auth.uid() and p.is_admin = true));

-- Property listings
alter table media_property_listings enable row level security;
create policy "Admins manage listings"
  on media_property_listings for all
  using (exists (select 1 from media_profiles p where p.id = auth.uid() and p.is_admin = true));
create policy "Clients manage own listings"
  on media_property_listings for all
  using (client_id in (
    select id from media_clients
    where email = (select email from auth.users where id = auth.uid())
  ));

-- Listing photos
alter table media_listing_photos enable row level security;
create policy "Admins manage listing photos"
  on media_listing_photos for all
  using (exists (select 1 from media_profiles p where p.id = auth.uid() and p.is_admin = true));
create policy "Clients manage own listing photos"
  on media_listing_photos for all
  using (listing_id in (
    select l.id from media_property_listings l
    join media_clients c on c.id = l.client_id
    where c.email = (select email from auth.users where id = auth.uid())
  ));

-- Generated marketing assets
alter table media_generated_marketing_assets enable row level security;
create policy "Admins manage generated assets"
  on media_generated_marketing_assets for all
  using (exists (select 1 from media_profiles p where p.id = auth.uid() and p.is_admin = true));
create policy "Clients read own generated assets"
  on media_generated_marketing_assets for select
  using (listing_id in (
    select l.id from media_property_listings l
    join media_clients c on c.id = l.client_id
    where c.email = (select email from auth.users where id = auth.uid())
  ));

-- Revision requests
alter table media_listing_revision_requests enable row level security;
create policy "Admins manage revision requests"
  on media_listing_revision_requests for all
  using (exists (select 1 from media_profiles p where p.id = auth.uid() and p.is_admin = true));
create policy "Clients manage own revision requests"
  on media_listing_revision_requests for all
  using (listing_id in (
    select l.id from media_property_listings l
    join media_clients c on c.id = l.client_id
    where c.email = (select email from auth.users where id = auth.uid())
  ));

-- ============================================================
-- STORAGE BUCKET (run separately in Supabase Dashboard or here)
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('listing-photos', 'listing-photos', true, 10485760, array['image/jpeg','image/png','image/webp','image/heic'])
on conflict (id) do nothing;

-- Storage policies for listing-photos bucket
create policy "Authenticated users upload listing photos"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'listing-photos');

create policy "Public read listing photos"
  on storage.objects for select to public
  using (bucket_id = 'listing-photos');

create policy "Users delete own listing photos"
  on storage.objects for delete to authenticated
  using (bucket_id = 'listing-photos' and auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Make a user admin: select make_admin('your@email.com');
create or replace function make_admin(target_email text)
returns void language plpgsql security definer as $$
declare
  target_id uuid;
begin
  select id into target_id from auth.users where email = target_email;
  if target_id is null then
    raise exception 'No user found with email %', target_email;
  end if;
  update media_profiles
  set is_admin = true, role = 'owner', updated_at = now()
  where id = target_id;
end;
$$;

-- Grant listing access manually: select grant_listing_access('client@email.com');
create or replace function grant_listing_access(target_email text)
returns void language plpgsql security definer as $$
begin
  update media_clients
  set has_listing_access = true, updated_at = now()
  where email = target_email;
end;
$$;
