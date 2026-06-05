-- 3B Media Group Schema
-- All tables prefixed with media_ to coexist with Credit Builder

-- Profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS media_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  email TEXT NOT NULL,
  full_name TEXT,
  is_admin BOOLEAN DEFAULT false
);

-- Leads
CREATE TABLE IF NOT EXISTS media_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company_name TEXT,
  service_interest TEXT,
  message TEXT,
  source TEXT DEFAULT 'website',
  status TEXT DEFAULT 'new',
  assigned_to UUID REFERENCES media_profiles(id),
  converted_customer_id UUID
);

-- Customers
CREATE TABLE IF NOT EXISTS media_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  company_name TEXT,
  stripe_customer_id TEXT UNIQUE,
  auth_user_id UUID REFERENCES auth.users(id),
  source_lead_id UUID REFERENCES media_leads(id),
  internal_notes TEXT
);

-- Add FK from leads to customers
ALTER TABLE media_leads
  ADD CONSTRAINT media_leads_converted_customer_fk
  FOREIGN KEY (converted_customer_id)
  REFERENCES media_customers(id);

-- Service Packages
CREATE TABLE IF NOT EXISTS media_service_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  stripe_price_id TEXT,
  stripe_product_id TEXT,
  base_price INTEGER NOT NULL,
  is_deposit BOOLEAN DEFAULT false,
  deposit_amount INTEGER,
  balance_amount INTEGER,
  is_recurring BOOLEAN DEFAULT false,
  order_type TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

-- Orders
CREATE TABLE IF NOT EXISTS media_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  customer_id UUID NOT NULL REFERENCES media_customers(id),
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  stripe_customer_id TEXT,
  package_id UUID REFERENCES media_service_packages(id),
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',
  payment_status TEXT DEFAULT 'pending',
  fulfillment_status TEXT DEFAULT 'pending',
  deposit_paid BOOLEAN DEFAULT false,
  balance_due INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'
);

-- Domain Requests
CREATE TABLE IF NOT EXISTS media_domain_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  order_id UUID REFERENCES media_orders(id),
  customer_id UUID NOT NULL REFERENCES media_customers(id),
  preferred_domains TEXT[] NOT NULL,
  selected_domain TEXT,
  registrar TEXT,
  registrar_order_id TEXT,
  acquisition_cost INTEGER,
  status TEXT DEFAULT 'submitted',
  dns_configured BOOLEAN DEFAULT false,
  email_configured BOOLEAN DEFAULT false,
  credentials_delivered BOOLEAN DEFAULT false,
  credential_reference TEXT,
  admin_notes TEXT,
  transfer_date TIMESTAMPTZ,
  expiry_date DATE
);

-- Brand Intakes
CREATE TABLE IF NOT EXISTS media_brand_intakes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  order_id UUID REFERENCES media_orders(id),
  customer_id UUID NOT NULL REFERENCES media_customers(id),
  business_name TEXT,
  industry TEXT,
  target_customer TEXT,
  business_description TEXT,
  tone_preference TEXT,
  color_preferences TEXT,
  inspiration_references TEXT,
  competitors TEXT,
  existing_assets_notes TEXT,
  raw_responses JSONB DEFAULT '{}'
);

-- Logo Projects
CREATE TABLE IF NOT EXISTS media_logo_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  order_id UUID REFERENCES media_orders(id),
  customer_id UUID NOT NULL REFERENCES media_customers(id),
  brand_intake_id UUID REFERENCES media_brand_intakes(id),
  status TEXT DEFAULT 'new',
  revisions_used INTEGER DEFAULT 0,
  revisions_included INTEGER DEFAULT 2,
  assigned_to UUID REFERENCES media_profiles(id),
  concept_presented_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  admin_notes TEXT
);

-- Website Questionnaires
CREATE TABLE IF NOT EXISTS media_website_questionnaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  order_id UUID REFERENCES media_orders(id),
  customer_id UUID NOT NULL REFERENCES media_customers(id),
  pages_needed TEXT[],
  website_purpose TEXT,
  key_messages JSONB,
  content_provided BOOLEAN DEFAULT false,
  has_photography BOOLEAN DEFAULT false,
  special_features TEXT[],
  inspiration_sites TEXT,
  competitor_sites TEXT,
  raw_responses JSONB DEFAULT '{}'
);

-- Website Projects
CREATE TABLE IF NOT EXISTS media_website_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  order_id UUID REFERENCES media_orders(id),
  customer_id UUID NOT NULL REFERENCES media_customers(id),
  questionnaire_id UUID REFERENCES media_website_questionnaires(id),
  logo_project_id UUID REFERENCES media_logo_projects(id),
  domain_request_id UUID REFERENCES media_domain_requests(id),
  status TEXT DEFAULT 'new',
  revisions_used INTEGER DEFAULT 0,
  revisions_included INTEGER DEFAULT 2,
  pages_count INTEGER,
  hosting_platform TEXT,
  live_url TEXT,
  assigned_to UUID REFERENCES media_profiles(id),
  kickoff_date DATE,
  target_launch_date DATE,
  launched_at TIMESTAMPTZ,
  launch_checklist_complete BOOLEAN DEFAULT false,
  admin_notes TEXT
);

-- Project Assets
CREATE TABLE IF NOT EXISTS media_project_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  project_type TEXT NOT NULL,
  project_id UUID NOT NULL,
  customer_id UUID NOT NULL REFERENCES media_customers(id),
  file_name TEXT NOT NULL,
  file_type TEXT,
  storage_path TEXT NOT NULL,
  asset_type TEXT,
  version INTEGER DEFAULT 1,
  uploaded_by UUID REFERENCES media_profiles(id),
  notes TEXT
);

-- Revisions
CREATE TABLE IF NOT EXISTS media_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  project_type TEXT NOT NULL,
  project_id UUID NOT NULL,
  customer_id UUID REFERENCES media_customers(id),
  round_number INTEGER NOT NULL,
  feedback TEXT NOT NULL,
  submitted_by TEXT DEFAULT 'client',
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  admin_response TEXT
);

-- Consultations
CREATE TABLE IF NOT EXISTS media_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company_name TEXT,
  service_interest TEXT,
  message TEXT,
  booked_at TIMESTAMPTZ,
  calendly_event_id TEXT,
  status TEXT DEFAULT 'booked',
  converted_lead_id UUID REFERENCES media_leads(id)
);

-- Activity Log
CREATE TABLE IF NOT EXISTS media_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,
  actor TEXT DEFAULT 'system',
  actor_id UUID REFERENCES media_profiles(id),
  details JSONB DEFAULT '{}'
);

-- Admin Notes
CREATE TABLE IF NOT EXISTS media_admin_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  note TEXT NOT NULL,
  author_id UUID REFERENCES media_profiles(id)
);

-- Email Events
CREATE TABLE IF NOT EXISTS media_email_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  customer_id UUID REFERENCES media_customers(id),
  lead_id UUID REFERENCES media_leads(id),
  to_email TEXT NOT NULL,
  template TEXT NOT NULL,
  resend_id TEXT,
  status TEXT DEFAULT 'sent',
  entity_type TEXT,
  entity_id UUID
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_media_leads_status ON media_leads(status);
CREATE INDEX IF NOT EXISTS idx_media_leads_email ON media_leads(email);
CREATE INDEX IF NOT EXISTS idx_media_orders_customer ON media_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_media_orders_stripe_session ON media_orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_media_orders_payment_status ON media_orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_media_domain_requests_customer ON media_domain_requests(customer_id);
CREATE INDEX IF NOT EXISTS idx_media_domain_requests_status ON media_domain_requests(status);
CREATE INDEX IF NOT EXISTS idx_media_logo_projects_status ON media_logo_projects(status);
CREATE INDEX IF NOT EXISTS idx_media_website_projects_status ON media_website_projects(status);
CREATE INDEX IF NOT EXISTS idx_media_activity_log_entity ON media_activity_log(entity_type, entity_id);

-- Seed: Service Packages
INSERT INTO media_service_packages (slug, name, description, base_price, order_type, sort_order) VALUES
  ('domain-starter', 'Domain Starter', 'Domain acquisition, DNS setup, and professional email configuration.', 19900, 'domain', 1),
  ('brand-starter', 'Brand Starter', 'Logo design with full file package and brand color palette.', 49900, 'logo', 2),
  ('website-launch', 'Website Launch', 'Up to 5-page professional website, mobile-first, SEO-ready.', 180000, 'website', 3),
  ('credibility-builder', 'Credibility Builder', 'Full stack: domain, logo, website, Google Business, LinkedIn setup.', 250000, 'bundle', 4),
  ('funding-readiness-web', 'Funding-Readiness Web Package', 'Complete professional presence built for funding conversations.', 350000, 'bundle', 5),
  ('done-for-you-launch', 'Done-For-You Launch', 'Everything handled. Domain, logo, 7-page site, copy, social setup.', 500000, 'bundle', 6),
  ('care-plan-basic', 'Care Plan Basic', 'Monthly updates, hosting management, and renewal reminders.', 9900, 'care_plan', 7),
  ('care-plan-standard', 'Care Plan Standard', 'Basic plan plus priority support and quarterly content updates.', 19900, 'care_plan', 8)
ON CONFLICT (slug) DO NOTHING;

-- RLS: Enable on all tables (admin access via service role, public read blocked)
ALTER TABLE media_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_domain_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_brand_intakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_logo_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_website_questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_website_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_project_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_admin_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_email_events ENABLE ROW LEVEL SECURITY;

-- Public can read service packages (for pricing page)
CREATE POLICY "media_packages_public_read" ON media_service_packages
  FOR SELECT USING (is_active = true);

-- Admin full access via service role (bypasses RLS by default)
-- No additional policies needed for server-side admin operations
