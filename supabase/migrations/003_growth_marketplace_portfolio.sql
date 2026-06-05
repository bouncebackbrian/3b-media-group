-- 3B Media Group — Growth Wizard, Marketplace, Portfolio, Ecosystem
-- Migration 003. All tables prefixed media_ per convention.
-- Designed forward-compatible: marketplace & portfolio tables are created now
-- so those features can be turned on later without a schema rebuild.

-- ============================================================
-- BUSINESS GROWTH WIZARD
-- ============================================================

-- Every wizard completion stored here. Lead is mirrored into media_leads
-- so it flows through the existing CRM/admin pipeline.
CREATE TABLE IF NOT EXISTS media_growth_wizard_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Lead capture (required before recommendations are revealed)
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,

  -- Step 1: Business information
  business_name TEXT,
  industry TEXT,
  years_in_business TEXT,
  employee_count TEXT,
  annual_revenue_range TEXT,

  -- Step 2: Online presence (booleans, nullable = "not answered")
  has_website BOOLEAN,
  has_social BOOLEAN,
  runs_ads BOOLEAN,
  collects_leads BOOLEAN,

  -- Step 3: Growth goals (multi-select)
  growth_goals TEXT[] DEFAULT '{}',

  -- Step 4: Business challenges (multi-select)
  challenges TEXT[] DEFAULT '{}',

  -- Recommendation engine output: array of
  --   { key, product, package, reason, ecosystem_product, cta_href }
  recommendations JSONB DEFAULT '[]',

  -- Linkage + lifecycle
  lead_id UUID REFERENCES media_leads(id),
  source TEXT DEFAULT 'growth_wizard',
  status TEXT DEFAULT 'new',
  follow_up_sent BOOLEAN DEFAULT false,
  raw_responses JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_media_wizard_email ON media_growth_wizard_submissions(email);
CREATE INDEX IF NOT EXISTS idx_media_wizard_status ON media_growth_wizard_submissions(status);
CREATE INDEX IF NOT EXISTS idx_media_wizard_created ON media_growth_wizard_submissions(created_at DESC);

-- Distinguish wizard leads inside the existing CRM. Older rows default to website.
ALTER TABLE media_leads ADD COLUMN IF NOT EXISTS lead_type TEXT DEFAULT 'general';

-- ============================================================
-- ECOSYSTEM CROSS-SELL TRACKING
-- Tracks recommendations/handoffs to other 3B products for analytics.
-- ============================================================
CREATE TABLE IF NOT EXISTS media_ecosystem_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  -- which ecosystem product: media_group | funding_machine | credit_builder
  --                          | fleet_commander | business_id | marketplace
  ecosystem_product TEXT NOT NULL,
  source_feature TEXT,                 -- e.g. 'growth_wizard'
  lead_id UUID REFERENCES media_leads(id),
  wizard_submission_id UUID REFERENCES media_growth_wizard_submissions(id),
  customer_id UUID REFERENCES media_customers(id),
  reason TEXT,
  status TEXT DEFAULT 'recommended',   -- recommended | clicked | converted
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_media_eco_referrals_product ON media_ecosystem_referrals(ecosystem_product);
CREATE INDEX IF NOT EXISTS idx_media_eco_referrals_lead ON media_ecosystem_referrals(lead_id);

-- ============================================================
-- ANALYTICS EVENTS (generic, append-only)
-- Funnel tracking for the wizard and future features.
-- ============================================================
CREATE TABLE IF NOT EXISTS media_analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  event_name TEXT NOT NULL,            -- e.g. 'wizard_started', 'wizard_completed'
  session_id TEXT,
  lead_id UUID REFERENCES media_leads(id),
  properties JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_media_analytics_event ON media_analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_media_analytics_created ON media_analytics_events(created_at DESC);

-- ============================================================
-- MARKETPLACE (scaffolding — listings hidden until launched)
-- ============================================================
CREATE TABLE IF NOT EXISTS media_marketplace_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS media_vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  auth_user_id UUID REFERENCES auth.users(id),
  customer_id UUID REFERENCES media_customers(id),
  display_name TEXT NOT NULL,
  slug TEXT UNIQUE,
  bio TEXT,
  logo_url TEXT,
  website_url TEXT,
  stripe_account_id TEXT,               -- Stripe Connect, for future payouts
  is_verified BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending',        -- pending | active | suspended
  rating_avg NUMERIC(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS media_service_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  vendor_id UUID REFERENCES media_vendors(id) ON DELETE CASCADE,
  category_id UUID REFERENCES media_marketplace_categories(id),
  title TEXT NOT NULL,
  slug TEXT,
  description TEXT,
  price INTEGER,                        -- cents; null = "quote"
  price_unit TEXT DEFAULT 'fixed',      -- fixed | hourly | monthly | quote
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS media_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  vendor_id UUID REFERENCES media_vendors(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES media_service_listings(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES media_customers(id),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  body TEXT,
  is_published BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS media_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  listing_id UUID REFERENCES media_service_listings(id),
  vendor_id UUID REFERENCES media_vendors(id),
  customer_id UUID REFERENCES media_customers(id),
  order_id UUID REFERENCES media_orders(id),
  scheduled_for TIMESTAMPTZ,
  status TEXT DEFAULT 'requested',      -- requested | confirmed | completed | cancelled
  notes TEXT,
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_media_listings_vendor ON media_service_listings(vendor_id);
CREATE INDEX IF NOT EXISTS idx_media_listings_category ON media_service_listings(category_id);
CREATE INDEX IF NOT EXISTS idx_media_reviews_vendor ON media_reviews(vendor_id);
CREATE INDEX IF NOT EXISTS idx_media_bookings_vendor ON media_bookings(vendor_id);

-- ============================================================
-- PORTFOLIO (case studies, testimonials)
-- ============================================================
CREATE TABLE IF NOT EXISTS media_portfolio_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  industry TEXT,
  logo_url TEXT,
  summary TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS media_case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  client_id UUID REFERENCES media_portfolio_clients(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  challenge TEXT,
  solution TEXT,
  results TEXT,
  before_image_url TEXT,
  after_image_url TEXT,
  metrics JSONB DEFAULT '[]',           -- [{ label, value }]
  is_published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS media_testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  client_id UUID REFERENCES media_portfolio_clients(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_title TEXT,
  quote TEXT NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Marketplace categories (per master vision)
INSERT INTO media_marketplace_categories (slug, name, description, icon, sort_order) VALUES
  ('marketing',       'Marketing',       'Social media management, advertising, content creation.', '◎', 1),
  ('websites',        'Websites',        'Business, realtor, and e-commerce websites.',             '▣', 2),
  ('ai-services',     'AI Services',     'Custom GPTs, AI automation, and AI training.',             '◈', 3),
  ('design',          'Design',          'Logos, branding, and graphic design.',                     '◆', 4),
  ('business-growth', 'Business Growth', 'Funding, credit, and consulting.',                         '◉', 5),
  ('transportation',  'Transportation',  'Fleet Commander services, recruiting, dispatch support.',  '⬡', 6)
ON CONFLICT (slug) DO NOTHING;

-- New monthly + one-time packages from the public pricing in the master vision.
-- order_type 'retainer' for monthly plans, 'service' for one-time.
INSERT INTO media_service_packages (slug, name, description, base_price, is_recurring, order_type, sort_order) VALUES
  ('social-starter',   'Starter',          '4 social posts, AI graphics, and caption writing each month.',        9900,  true,  'retainer', 10),
  ('social-growth',    'Growth',           '8 posts, 2 reels, open house promotion, and a content calendar.',     19900, true,  'retainer', 11),
  ('social-pro',       'Business Pro',     '12 posts, 4 reels, and ongoing marketing support.',                   34900, true,  'retainer', 12),
  ('starter-website',  'Starter Website',  'A clean one-page presence to get your business online fast.',         29900, false, 'website',  13),
  ('business-website', 'Business Website', 'A multi-page business website built to convert.',                     59900, false, 'website',  14),
  ('professional-website', 'Professional Website', 'A premium website with advanced features and integrations.', 99900, false, 'website', 15),
  ('open-house-blast', 'Open House Blast', 'A promotional blast to market your open house.',                      2900,  false, 'service',  16),
  ('listing-marketing','Listing Marketing Package', 'A full marketing package for a single listing.',            4900,  false, 'service',  17),
  ('reel-creation',    'Reel Creation',    'One professionally produced short-form reel.',                        2500,  false, 'service',  18)
ON CONFLICT (slug) DO NOTHING;

-- Initial showcase client: Madalyn (Real Estate)
INSERT INTO media_portfolio_clients (slug, name, industry, summary, is_featured, sort_order) VALUES
  ('madalyn-real-estate', 'Madalyn', 'Real Estate',
   'A realtor who needed a modern online presence and consistent social marketing to stand out in a competitive market.',
   true, 1)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- ROW LEVEL SECURITY
-- Admin/server writes via service role (bypasses RLS). Public read where noted.
-- ============================================================
ALTER TABLE media_growth_wizard_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_ecosystem_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_marketplace_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_service_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_portfolio_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_testimonials ENABLE ROW LEVEL SECURITY;

-- Public can browse marketplace + portfolio content
CREATE POLICY "media_categories_public_read" ON media_marketplace_categories
  FOR SELECT USING (is_active = true);
CREATE POLICY "media_vendors_public_read" ON media_vendors
  FOR SELECT USING (status = 'active');
CREATE POLICY "media_listings_public_read" ON media_service_listings
  FOR SELECT USING (is_active = true);
CREATE POLICY "media_reviews_public_read" ON media_reviews
  FOR SELECT USING (is_published = true);
CREATE POLICY "media_portfolio_clients_public_read" ON media_portfolio_clients
  FOR SELECT USING (is_published = true);
CREATE POLICY "media_case_studies_public_read" ON media_case_studies
  FOR SELECT USING (is_published = true);
CREATE POLICY "media_testimonials_public_read" ON media_testimonials
  FOR SELECT USING (is_published = true);
