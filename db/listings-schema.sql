-- ============================================================
-- 3B Media Group — Real Estate Listings Schema
-- Run AFTER schema.sql
-- ============================================================

-- ============================================================
-- Add listing access flag to clients
-- ============================================================
alter table media_clients
  add column if not exists has_listing_access boolean not null default false;

-- ============================================================
-- PROPERTY LISTINGS
-- ============================================================
create table if not exists media_property_listings (
  id                    uuid primary key default uuid_generate_v4(),
  client_id             uuid not null references media_clients(id) on delete cascade,

  -- Required fields
  property_address      text not null,
  listing_price         text not null,
  bedrooms              integer,
  bathrooms             numeric(3,1),
  square_footage        integer,
  listing_description   text,
  realtor_name          text not null,
  realtor_phone         text,
  realtor_email         text,

  -- Optional fields
  lot_size              text,
  mls_link              text,
  open_house_date       date,
  open_house_time       text,
  neighborhood_highlights text,
  school_area_notes     text,
  key_features          text[],
  preferred_tone        text,
  preferred_cta         text,
  special_instructions  text,

  -- Status tracking
  status                text not null default 'submitted'
                          check (status in (
                            'submitted','generating','generated',
                            'in_review','approved','revision_requested','completed'
                          )),

  -- Service context (which product triggered this)
  service_package_slug  text,
  order_id              uuid references media_orders(id) on delete set null,

  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists media_property_listings_client_idx on media_property_listings(client_id);
create index if not exists media_property_listings_status_idx on media_property_listings(status);

-- ============================================================
-- LISTING PHOTOS
-- ============================================================
create table if not exists media_listing_photos (
  id              uuid primary key default uuid_generate_v4(),
  listing_id      uuid not null references media_property_listings(id) on delete cascade,
  storage_path    text not null,
  public_url      text not null,
  category        text not null default 'other'
                    check (category in (
                      'exterior','kitchen','living_room','bedroom',
                      'bathroom','backyard','other'
                    )),
  sort_order      integer not null default 0,
  uploaded_by     uuid references auth.users(id) on delete set null,
  created_at      timestamptz not null default now()
);

create index if not exists media_listing_photos_listing_idx on media_listing_photos(listing_id);

-- ============================================================
-- GENERATED MARKETING ASSETS
-- ============================================================
create table if not exists media_generated_marketing_assets (
  id                  uuid primary key default uuid_generate_v4(),
  listing_id          uuid not null references media_property_listings(id) on delete cascade,

  -- Individual asset fields
  facebook_listing    text,
  facebook_open_house text,
  instagram_caption   text,
  reel_script         text,
  flyer_copy          text,
  hashtags            text,
  sms_copy            text,
  email_copy          text,

  -- Generation metadata
  model_used          text,
  generation_version  integer not null default 1,
  is_current          boolean not null default true,

  created_at          timestamptz not null default now()
);

create index if not exists media_generated_assets_listing_idx on media_generated_marketing_assets(listing_id);

-- ============================================================
-- LISTING CONTENT REQUESTS (revision workflow)
-- ============================================================
create table if not exists media_listing_revision_requests (
  id              uuid primary key default uuid_generate_v4(),
  listing_id      uuid not null references media_property_listings(id) on delete cascade,
  asset_type      text,   -- which asset to revise, or null for all
  notes           text not null,
  status          text not null default 'pending'
                    check (status in ('pending','in_review','completed')),
  admin_response  text,
  created_at      timestamptz not null default now()
);

-- ============================================================
-- RLS POLICIES
-- ============================================================

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
-- STORAGE: Create bucket (run in Supabase dashboard or via API)
-- ============================================================
-- In Supabase Dashboard → Storage → New Bucket:
--   Name: listing-photos
--   Public: true (photos are served publicly for asset generation)
--   File size limit: 10MB
--
-- Or via SQL:
-- insert into storage.buckets (id, name, public, file_size_limit)
-- values ('listing-photos', 'listing-photos', true, 10485760)
-- on conflict do nothing;
