-- Create subscriptions table if it doesn't exist
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  price_id TEXT,
  status TEXT NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);

-- Create RLS policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own subscriptions
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON subscriptions;
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Only allow service role to insert/update/delete
DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON subscriptions;
CREATE POLICY "Service role can manage all subscriptions"
  ON subscriptions
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Create a function to safely get user subscriptions
CREATE OR REPLACE FUNCTION get_user_subscription(user_id_param UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  price_id TEXT,
  status TEXT,
  cancel_at_period_end BOOLEAN,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if the subscriptions table exists
  IF EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'subscriptions'
  ) THEN
    -- Return subscription data if table exists
    RETURN QUERY
    SELECT s.id, s.user_id, s.price_id, s.status, 
           s.cancel_at_period_end, s.current_period_end,
           s.created_at, s.updated_at
    FROM subscriptions s
    WHERE s.user_id = user_id_param
    ORDER BY s.created_at DESC
    LIMIT 1;
  ELSE
    -- Return empty result if table doesn't exist
    RETURN;
  END IF;
END;
$$; 