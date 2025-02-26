-- Create subscriptions table if it doesn't exist
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Create feature_usage table if it doesn't exist
CREATE TABLE IF NOT EXISTS feature_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_type TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_feature_usage_user_id ON feature_usage(user_id);

-- Create index on feature_type for faster lookups
CREATE INDEX IF NOT EXISTS idx_feature_usage_feature_type ON feature_usage(feature_type);

-- Create index on created_at for faster date range queries
CREATE INDEX IF NOT EXISTS idx_feature_usage_created_at ON feature_usage(created_at);

-- Create composite index on user_id and feature_type for faster lookups
CREATE INDEX IF NOT EXISTS idx_feature_usage_user_feature ON feature_usage(user_id, feature_type);

-- Create RLS policies
ALTER TABLE feature_usage ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own usage
DROP POLICY IF EXISTS "Users can view their own usage" ON feature_usage;
CREATE POLICY "Users can view their own usage"
  ON feature_usage
  FOR SELECT
  USING (auth.uid() = user_id);

-- Only allow service role to insert/update/delete
DROP POLICY IF EXISTS "Service role can manage all usage" ON feature_usage;
CREATE POLICY "Service role can manage all usage"
  ON feature_usage
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role'); 