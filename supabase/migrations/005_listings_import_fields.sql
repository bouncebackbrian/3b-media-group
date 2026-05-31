-- Migration 005: Add URL import fields to media_property_listings
ALTER TABLE media_property_listings
  ADD COLUMN IF NOT EXISTS source_url                 TEXT,
  ADD COLUMN IF NOT EXISTS imported_from              TEXT,    -- zillow, redfin, realtor, mls, other
  ADD COLUMN IF NOT EXISTS import_confirmed_permission BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS imported_raw_data          JSONB;
