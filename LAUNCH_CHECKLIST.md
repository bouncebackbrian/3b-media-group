# 3B Media Group — Launch Checklist

Work through this top-to-bottom before going live. Each section must be complete before moving to the next.

---

## 1. Supabase — Run Migration

**For a fresh project (recommended):** run the single consolidated file:

```
DEPLOY.sql
```

Open **Supabase Dashboard → SQL Editor → New query**, paste the entire file, and run.

This creates all tables, seeds all packages (including Realtor Marketing), sets all RLS policies, creates the `listing-photos` storage bucket and policies, and installs the `make_admin` / `grant_listing_access` helper functions.

> **Verify:** After running, check **Supabase → Table Editor** — you should see ~20 tables all prefixed `media_`.

---

**For an existing project (incremental):** run in this order instead:

| # | File | What it does |
|---|------|--------------|
| 1 | `supabase/migrations/001_media_schema.sql` | Legacy core tables |
| 2 | `supabase/migrations/002_orders_subscription_id.sql` | Adds `stripe_subscription_id` to orders |
| 3 | `supabase/migrations/003_growth_marketplace_portfolio.sql` | Growth wizard, marketplace, portfolio |
| 4 | `supabase/migrations/004_orders_client_link.sql` | Adds `client_id` to orders + backfill |
| 5 | `db/listings-schema.sql` | Listing workflow tables |

---

## 2. Supabase — Storage Bucket

1. Go to **Supabase Dashboard → Storage → New Bucket**
2. Create a bucket with these settings:
   - **Name:** `listing-photos`
   - **Public:** ✅ Yes (photos are served publicly for the portal and asset generation)
   - **File size limit:** `10485760` (10 MB)
3. Add a storage policy so authenticated users can upload to their own listing folder:

```sql
-- Allow authenticated users to upload to listing-photos bucket
-- (paths are namespaced by listing_id so no cross-contamination)
CREATE POLICY "Authenticated users can upload listing photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'listing-photos');

CREATE POLICY "Public read of listing photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'listing-photos');
```

---

## 3. Supabase — Bootstrap First Admin

After running migrations, set up the first admin account:

```sql
-- Replace with actual admin email
SELECT make_admin('admin@3bmediagroup.com');
```

If the `make_admin` function doesn't exist yet, run manually:

```sql
UPDATE media_profiles
SET is_admin = true
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'admin@3bmediagroup.com'
);
```

---

## 4. Stripe — Product Sync

All products are seeded via `supabase/migrations/001_media_schema.sql`. You still need to create matching Stripe products and link their `price_id` values.

For each package in `media_service_packages`:

1. Create the product and price in **Stripe Dashboard → Products**
2. Copy the `price_id` (starts with `price_`)
3. Update the package record:

```sql
UPDATE media_service_packages
SET stripe_price_id = 'price_XXXXXXXXXXXXXXXX'
WHERE slug = 'open-house-blast';
```

| Slug | Type | Amount |
|------|------|--------|
| `starter` | Recurring monthly | $99 |
| `growth` | Recurring monthly | $199 |
| `business-pro` | Recurring monthly | $349 |
| `open-house-blast` | One-time | $29 |
| `listing-marketing` | One-time | $49 |
| `reel-creation` | One-time | $25 |
| `website-starter` | One-time | $299 |
| `website-business` | One-time | $599 |
| `website-pro` | One-time | $999 |

---

## 5. Stripe — Webhook Setup

1. Go to **Stripe Dashboard → Developers → Webhooks → Add endpoint**
2. **Endpoint URL:** `https://your-domain.com/api/webhooks/stripe`
3. **Events to listen for:**
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
   - `customer.subscription.deleted`
4. Copy the **Signing secret** (starts with `whsec_`)
5. Set it as `STRIPE_WEBHOOK_SECRET` in Vercel

For local testing, install Stripe CLI and run:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## 6. Vercel — Environment Variables

Set all of the following in **Vercel Dashboard → Project → Settings → Environment Variables** for Production, Preview, and Development:

| Variable | Where to get it | Required |
|----------|----------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API | ✅ |
| `STRIPE_SECRET_KEY` | Stripe → Developers → API Keys | ✅ |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Webhooks → Signing secret | ✅ |
| `NEXT_PUBLIC_BASE_URL` | Your production domain (`https://...`) | ✅ |
| `ANTHROPIC_API_KEY` | Anthropic Console → API Keys | ✅ (for AI generation) |
| `RESEND_API_KEY` | Resend Dashboard | Optional (email notifications) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics | Optional |
| `NEXT_PUBLIC_CLARITY_ID` | Microsoft Clarity | Optional |

> ⚠️ Never commit `.env.local` to git. The `.gitignore` already excludes it.

---

## 7. QA Checklist — Run Through Each Flow

### 7a. Checkout Flow
- [ ] Open `/pricing` and select **Open House Blast**
- [ ] Complete Stripe test checkout (`4242 4242 4242 4242`, any future date, any CVC)
- [ ] Confirm redirect to `/success`
- [ ] Check Supabase `media_customers` — new row with buyer email
- [ ] Check Supabase `media_orders` — new row, `payment_status = paid`, `package_id` set
- [ ] Check Stripe Dashboard — order appears in payments

### 7b. Portal Login & Client Record
- [ ] Create a Supabase Auth user (or have the buyer sign up at `/portal/login`)
- [ ] Manually create a `media_clients` row with matching email (or confirm auto-creation if webhook does it)
- [ ] Log in at `/portal/login`
- [ ] Confirm redirect to `/portal/dashboard`

### 7c. Listing Access Gate
- [ ] Open `/portal/listings` — should show "Unlock Listing Marketing" gate if no paid order
- [ ] After completing checkout (7a), refresh — gate should disappear and "+ Add Listing" appears

### 7d. Listing Intake Form
- [ ] Click **+ Add Listing**
- [ ] Fill Step 1: address, price, beds, baths, sq ft, description
- [ ] Fill Step 2: realtor name, open house date/time
- [ ] Fill Step 3: select tone, CTA, special instructions
- [ ] Submit — confirm redirect to listing detail page
- [ ] Check Supabase `media_property_listings` — new row with `status = submitted`

### 7e. Photo Upload
- [ ] On listing detail page, select a category and click the upload area
- [ ] Upload 1–3 test images
- [ ] Confirm images appear in the photo grid
- [ ] Check Supabase `media_listing_photos` — rows with correct `listing_id`
- [ ] Check Supabase Storage `listing-photos` bucket — files present

### 7f. Asset Generation
- [ ] Click **Generate Marketing Assets**
- [ ] Wait ~15–30 seconds (spinner shows)
- [ ] Confirm listing status changes to `generated`
- [ ] Browse each asset tab: Facebook, Instagram, Reel Script, Flyer, Hashtags, SMS, Email
- [ ] Click **Copy** on each — confirm clipboard is populated
- [ ] Check Supabase `media_generated_marketing_assets` — row with `is_current = true`

### 7g. Revision Request
- [ ] Click **Request Revision** on any asset
- [ ] Enter revision notes and submit
- [ ] Confirm listing status changes to `revision_requested`
- [ ] Check Supabase `media_listing_revision_requests` — new row

### 7h. Admin Approval Flow
- [ ] Log in to admin at `/admin/login`
- [ ] Open `/admin/listings` — new listing appears
- [ ] Click **Review →** to open detail
- [ ] Review generated assets (all 8 tabs)
- [ ] View uploaded photos
- [ ] View revision requests
- [ ] Update status to `approved` via the status selector
- [ ] Add admin notes and click **Save Changes**
- [ ] Confirm status chip updates in the listing list

### 7i. End-to-end Subscription Cancellation
- [ ] Cancel the test subscription in Stripe Dashboard
- [ ] Confirm Stripe fires `customer.subscription.deleted` webhook
- [ ] Confirm `media_orders.fulfillment_status` updates to `cancelled`

---

## 8. Pre-Launch Final Checks

- [ ] `npm run build` passes with zero TypeScript errors
- [ ] All environment variables are set in Vercel production
- [ ] Custom domain is pointed to Vercel
- [ ] Stripe webhook endpoint points to production URL (not localhost)
- [ ] Supabase project is not paused
- [ ] Admin account exists and `is_admin = true`
- [ ] At least one test order exists to confirm the access gate works
