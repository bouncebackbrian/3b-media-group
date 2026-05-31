-- Migration 004: Link media_orders to media_clients
-- Adds client_id to media_orders so future orders written by the webhook
-- can be queried directly by client without going through media_customers.
-- Also adds an index on package_id for listing access queries.

ALTER TABLE media_orders
  ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES media_clients(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_media_orders_client ON media_orders(client_id);
CREATE INDEX IF NOT EXISTS idx_media_orders_package ON media_orders(package_id);

-- Backfill client_id for any existing orders where the customer email
-- matches a known media_clients record.
UPDATE media_orders o
SET client_id = c.id
FROM media_customers cu
JOIN media_clients c ON c.email = cu.email
WHERE o.customer_id = cu.id
  AND o.client_id IS NULL;
