# 3B Media Group — Real Estate Listing Demo Workflow

This document walks through the complete end-to-end experience for a real estate agent who purchases a service and uses the listing marketing automation.

---

## Cast

| Role | Who |
|------|-----|
| **Customer / Realtor** | Jane Smith — a real estate agent |
| **Admin** | 3B Media Group team member |

---

## Step 1 — Customer Buys Open House Blast

**Jane is on the 3B Media Group pricing page.**

1. Jane opens `/pricing` and sees the **Open House Blast — $29** card
2. She clicks **Get Started**
3. She is taken to Stripe Checkout
4. She enters her card (`4242 4242 4242 4242` for testing) and pays
5. She lands on `/success` with a confirmation message

**What happens in the background:**
- Stripe fires `checkout.session.completed`
- Webhook creates a `media_customers` record for Jane's email
- Webhook creates a `media_orders` record: `payment_status = paid`, `package_id` linked to `open-house-blast`
- Webhook logs the activity to `media_activity_log`

---

## Step 2 — Customer Gets Portal Access

**Jane receives a welcome email and creates her portal account.**

1. Jane goes to `/portal/login`
2. She signs up with her email (the same one she used at checkout)
3. A `media_profiles` row is auto-created via Supabase Auth trigger
4. A `media_clients` row is created by the admin team (or auto-provisioned if configured)
5. Jane logs in and lands on `/portal/dashboard`

**Dashboard shows:**
- Active Projects: 0
- Needs Review: 0
- Waiting on You: 0
- Completed: 0

> **Admin step:** After Jane pays, create her `media_clients` record with her email so portal access is linked. The admin can do this at `/admin/clients`.

---

## Step 3 — Customer Submits a Property Listing

**Jane opens the Listings section.**

1. Jane clicks **Listings** in the portal sidebar
2. Because she has a paid `open-house-blast` order, the listing intake form unlocks immediately
3. She clicks **+ Add Listing**
4. She fills out the 3-step intake form:

**Step 1 — Property Details:**
- Address: `123 Oak Street, Austin, TX 78701`
- Price: `$485,000`
- Beds: `4`, Baths: `2.5`, Sq Ft: `2,100`
- Description: *"Stunning 4-bed craftsman in the heart of South Austin…"*
- Key Features: Updated Kitchen, Hardwood Floors, Two-Car Garage, Pool

**Step 2 — Realtor & Dates:**
- Realtor Name: `Jane Smith`
- Phone: `(512) 555-0100`
- Email: `jane@austinrealty.com`
- MLS Link: `https://...`
- Open House Date: `Saturday, June 7`
- Open House Time: `1:00 PM – 4:00 PM`
- Neighborhood: *"Walkable to South Congress, Barton Springs nearby"*

**Step 3 — Marketing Preferences:**
- Tone: `Professional & Warm`
- CTA: `Contact me today for a private showing`
- Special Instructions: `Focus on the pool and outdoor entertaining space`

5. Jane clicks **Submit Listing & Generate Assets**

**What happens:**
- `media_property_listings` row is created with `status = submitted`
- Jane is redirected to the listing detail page

---

## Step 4 — Customer Uploads Photos

**Jane is on the listing detail page.**

1. She sees the **Property Photos** section
2. She selects the category (Exterior, Kitchen, Living Room, etc.)
3. She drags or clicks to upload photos from her device
4. Photos upload directly to Supabase Storage (`listing-photos` bucket)
5. Thumbnails appear in the photo grid grouped by category

**What happens:**
- Each photo is stored at `listing-photos/{listing_id}/{category}/{timestamp}.jpg`
- `media_listing_photos` rows are created with `public_url` and `sort_order`

---

## Step 5 — System Generates Marketing Assets

**Jane clicks Generate (or it auto-triggers on form submit).**

1. Jane sees the **"Ready to generate marketing assets"** prompt
2. She clicks **Generate Marketing Assets →**
3. A spinner shows: *"Generating…"*
4. After ~15–30 seconds, 8 marketing assets appear in the sidebar

**Assets generated:**
| Asset | What it contains |
|-------|-----------------|
| **Facebook Listing Post** | 150–200 word post with price, features, CTA, formatted for readability |
| **Facebook Open House Post** | Dedicated open house post with date, time, and what to expect |
| **Instagram Caption** | 100–150 words with emojis, hook, selling points, "Link in bio" close |
| **Reel Script** | 30–45 second video script with [SCENE] markers and a closing CTA |
| **Flyer Copy** | Headline, subheadline, 6 bullet features, description paragraph, agent block |
| **Hashtag Set** | 30 relevant hashtags: location, real estate, lifestyle, property-specific |
| **SMS Copy** | 160-character blast with address, price, key stat, link placeholder |
| **Email Copy** | Full email with subject, preview text, greeting, body, highlights, CTA |

**What happens in Supabase:**
- `media_property_listings.status` → `generating` → `generated`
- `media_generated_marketing_assets` row created with all 8 assets, `is_current = true`
- `media_content_requests` row auto-created for admin review notification

---

## Step 6 — Admin Reviews and Approves

**The admin team gets notified and opens the listing.**

1. Admin logs in at `/admin/login`
2. Admin opens `/admin/listings`
3. The new listing appears with status badge **Generated**
4. Admin clicks **Review →**
5. Admin sees:
   - Property details (address, price, beds/baths/sqft, realtor contact)
   - Uploaded photos (thumbnail grid)
   - All 8 generated assets (tab sidebar with copy button)
   - Any revision requests from the client

6. Admin reads through the assets, checks tone and accuracy
7. Admin sets status to **Approved** using the status selector
8. Admin optionally adds internal notes: *"Looks great — approved as-is"*
9. Admin clicks **Save Changes**

**What happens:**
- `media_property_listings.status` → `approved`
- Admin notes saved to `admin_notes` field

---

## Step 7 — Customer Copies / Downloads Approved Content

**Jane comes back to her portal to get the final assets.**

1. Jane opens `/portal/listings`
2. She sees her listing with status badge **Approved** (green)
3. She clicks into the listing
4. She browses each asset tab in the **Generated Marketing Assets** panel
5. She clicks **Copy** on each asset she wants to use
6. She pastes directly into Facebook, Instagram, Canva, her email tool, etc.

**Requesting a revision (if needed):**
1. Jane clicks **Request Revision** on any asset
2. She writes: *"Can you make the Instagram caption more energetic? And include the pool more prominently."*
3. She submits — status changes to **Revision Requested**
4. Admin sees the revision request on the detail page
5. Admin regenerates or manually edits the asset and re-approves

---

## Summary Flow Diagram

```
Jane pays → Webhook creates order (package_id linked)
         → Admin creates client record
         → Jane logs in to portal

Jane opens /portal/listings → Access gate checks for paid order
                            → Gate passes → shows listings dashboard

Jane submits listing form → media_property_listings created (status: submitted)

Jane uploads photos → stored in Supabase Storage
                    → media_listing_photos rows created

Jane clicks Generate → Claude API generates 8 assets
                     → media_generated_marketing_assets saved (is_current: true)
                     → Listing status: generated
                     → Admin content request auto-created

Admin reviews at /admin/listings/[id]
→ Reads assets, views photos, checks revision requests
→ Sets status: approved

Jane copies assets from portal → ready to publish
```
