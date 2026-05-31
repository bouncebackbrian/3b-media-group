# 3B Media Group — Supabase Setup Reference

This document is the technical reference for the Supabase project backing the 3B Media Group platform.

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project API URL — found in Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anonymous (public) key — safe to expose in browser |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key — **never expose in client code** |

The service role key bypasses Row Level Security. It is only used in server-side API routes and webhook handlers.

---

## Migrations

**Fresh project:** run `DEPLOY.sql` — one file, everything included.

**Incremental (existing project):** run files in `supabase/migrations/` in order.

All migration files live in `supabase/migrations/`. Run them in the SQL Editor in the Supabase Dashboard.

### `001_media_schema.sql`
Core schema. Creates:
- `media_profiles` — user profile data, linked to `auth.users`
- `media_leads` — prospect CRM records
- `media_clients` — paying customer records; portal access tied to this table
- `media_service_packages` — product catalog with Stripe price IDs and slugs
- `media_customers` — Stripe customer mapping (email → stripe_customer_id)
- `media_orders` — purchase records linked to customers and packages
- `media_projects` — project/work-order records
- `media_content_requests` — general content submission requests
- `media_uploaded_files` — file upload references
- `media_domain_requests` — domain registration requests
- `media_testimonials` — client testimonials
- `media_portfolio_clients` — published portfolio case studies
- `media_activity_log` — event audit trail

Also seeds 9 service packages (Starter, Growth, Business Pro, Open House Blast, Listing Marketing, Reel Creation, 3 website tiers).

### `002_orders_subscription_id.sql`
Adds `stripe_subscription_id TEXT` to `media_orders` so the `customer.subscription.deleted` webhook can match by subscription ID.

### `003_growth_marketplace_portfolio.sql`
Adds:
- `media_growth_wizard_submissions` — business assessment wizard responses
- `media_ecosystem_referrals` — product recommendations from wizard results
- `media_analytics_events` — custom event tracking
- `media_email_events` — email delivery status tracking
- `media_marketplace_vendors` — vendor directory
- `media_marketplace_services` — vendor services catalog
- `media_marketplace_orders` — marketplace purchase records

### `004_orders_client_link.sql`
Adds `client_id UUID` to `media_orders`, referencing `media_clients`. Backfills existing orders by matching `media_customers.email → media_clients.email`. Adds performance indexes on `package_id` and `client_id`.

### `db/listings-schema.sql` (or `db/migrations/20260530_media_property_listings.sql`)
Real estate listing workflow. Creates:
- `media_property_listings` — full intake form data, realtor info, status workflow
- `media_listing_photos` — photo references stored in Supabase Storage
- `media_generated_marketing_assets` — 8 AI-generated copy assets per listing
- `media_listing_revision_requests` — client revision requests with admin response

Also adds `has_listing_access BOOLEAN` to `media_clients` for manual overrides.

---

## Table Reference

### `media_clients`
Portal access is gated by this table. A user whose `auth.users.email` matches a `media_clients.email` row can log in to the portal.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `email` | text | unique; must match auth user email |
| `full_name` | text | |
| `company_name` | text | |
| `status` | text | active, inactive, pending, churned |
| `billing_status` | text | pending, current, overdue, cancelled |
| `has_listing_access` | boolean | manual override for listing intake |
| `user_id` | uuid | optional link to auth.users |

### `media_orders`
Created by the Stripe webhook on `checkout.session.completed`.

| Column | Type | Notes |
|--------|------|-------|
| `customer_id` | uuid | FK → media_customers |
| `client_id` | uuid | FK → media_clients (added in migration 004) |
| `package_id` | uuid | FK → media_service_packages; populated by webhook from metadata.package_slug |
| `stripe_session_id` | text | unique; `cs_...` |
| `stripe_payment_intent_id` | text | `pi_...` |
| `stripe_subscription_id` | text | `sub_...`; required for cancellation matching |
| `payment_status` | text | pending, paid, failed, refunded |

### `media_service_packages`
Seeded with 9 products. The `slug` field is the canonical identifier used in checkout metadata and access checks.

| Slug | Type | Price |
|------|------|-------|
| `starter` | monthly | $99 |
| `growth` | monthly | $199 |
| `business-pro` | monthly | $349 |
| `open-house-blast` | one_time | $29 |
| `listing-marketing` | one_time | $49 |
| `reel-creation` | one_time | $25 |
| `website-starter` | one_time | $299 |
| `website-business` | one_time | $599 |
| `website-pro` | one_time | $999 |

**Listing access** is granted to buyers of: `open-house-blast`, `listing-marketing`, `realtor-marketing`, `growth`, `business-pro`.

### `media_property_listings`
One row per submitted listing. Status workflow:

```
submitted → generating → generated → in_review → approved → completed
                                  ↘ revision_requested → in_review → approved
```

### `media_generated_marketing_assets`
One row per generation run. `is_current = true` marks the active version. Previous versions have `is_current = false` (kept for audit trail).

### `media_listing_photos`
Photos are uploaded to Supabase Storage bucket `listing-photos` at path `{listing_id}/{category}/{timestamp}.{ext}`. The `public_url` is stored here for display.

---

## Row Level Security Policies

### Key patterns used throughout

**Admin full access:**
```sql
using (exists (
  select 1 from media_profiles p
  where p.id = auth.uid() and p.is_admin = true
))
```

**Client scoped to own data:**
```sql
using (client_id in (
  select id from media_clients
  where email = (select email from auth.users where id = auth.uid())
))
```

**Public read:**
```sql
using (is_public = true)
-- or
using (is_published = true)
```

### Tables and their RLS stance

| Table | Public read | Client scoped | Admin full |
|-------|-------------|---------------|------------|
| `media_service_packages` | ✅ (`is_public`) | — | ✅ |
| `media_portfolio_clients` | ✅ (`is_published`) | — | ✅ |
| `media_testimonials` | ✅ | — | ✅ |
| `media_clients` | — | ✅ (own row) | ✅ |
| `media_projects` | — | ✅ | ✅ |
| `media_content_requests` | — | ✅ | ✅ |
| `media_orders` | — | ✅ | ✅ |
| `media_uploaded_files` | — | ✅ | ✅ |
| `media_leads` | — | — | ✅ (admin only) |
| `media_property_listings` | — | ✅ | ✅ |
| `media_listing_photos` | — | ✅ | ✅ |
| `media_generated_marketing_assets` | — | ✅ (SELECT only) | ✅ |
| `media_listing_revision_requests` | — | ✅ | ✅ |

---

## Storage Bucket: `listing-photos`

| Setting | Value |
|---------|-------|
| Name | `listing-photos` |
| Public | Yes |
| Max file size | 10 MB (10485760 bytes) |
| Allowed MIME types | `image/*` |

**Path convention:** `{listing_id}/{category}/{timestamp}-{random}.{ext}`

Storage policies required:
```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users upload listing photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'listing-photos');

-- Allow public read (photos served in portal and assets)
CREATE POLICY "Public read listing photos"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'listing-photos');
```

Photo uploads are handled client-side in `PhotoUpload.tsx` using `@supabase/ssr` browser client, then the path and public URL are saved to `media_listing_photos` via `POST /api/listings/photos/save`.

---

## Supabase Auth Configuration

| Setting | Value |
|---------|-------|
| Auth provider | Email (enabled by default) |
| Confirm email | Recommended for production |
| Site URL | Set to your production domain |
| Redirect URLs | `https://your-domain.com/**` |

A `media_profiles` row is created automatically on `auth.users` insert via a database trigger defined in `001_media_schema.sql`.

---

## Useful SQL Snippets

### Make a user admin
```sql
UPDATE media_profiles
SET is_admin = true
WHERE id = (SELECT id FROM auth.users WHERE email = 'user@example.com');
```

### Grant listing access manually
```sql
UPDATE media_clients
SET has_listing_access = true
WHERE email = 'client@example.com';
```

### Check what a client has purchased
```sql
SELECT o.id, o.created_at, o.payment_status, p.name, p.slug
FROM media_orders o
JOIN media_customers cu ON cu.id = o.customer_id
JOIN media_service_packages p ON p.id = o.package_id
WHERE cu.email = 'client@example.com'
ORDER BY o.created_at DESC;
```

### View all listings needing admin attention
```sql
SELECT l.id, l.property_address, l.status, l.created_at,
       c.full_name, c.email
FROM media_property_listings l
JOIN media_clients c ON c.id = l.client_id
WHERE l.status IN ('submitted','generated','revision_requested')
ORDER BY l.created_at ASC;
```
