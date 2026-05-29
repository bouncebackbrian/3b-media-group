-- Add stripe_subscription_id to media_orders so subscription cancellation
-- webhooks (customer.subscription.deleted) can match by sub_... id,
-- not stripe_session_id which is a cs_... id and never matches.
ALTER TABLE media_orders ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
CREATE INDEX IF NOT EXISTS idx_media_orders_stripe_subscription ON media_orders(stripe_subscription_id);
