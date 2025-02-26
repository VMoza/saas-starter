-- Create a function to create the migrations table
CREATE OR REPLACE FUNCTION create_migrations_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS _migrations (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    sql TEXT NOT NULL,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
END;
$$; 