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