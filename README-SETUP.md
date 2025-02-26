# Setup Instructions

## Database Setup

To fix the database issues, you need to run the SQL script in the Supabase SQL editor:

1. Log in to your Supabase dashboard
2. Select your project
3. Go to the SQL Editor
4. Create a new query
5. Copy and paste the contents of `src/lib/db/supabase-sql-editor.sql` into the editor
6. Run the query

This will create the necessary tables and policies for the application to work correctly.

## Environment Variables

Make sure your `.env.local` file has the following variables:

```
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
PRIVATE_SUPABASE_SERVICE_ROLE=your_supabase_service_role_key
PRIVATE_STRIPE_API_KEY=your_stripe_api_key
PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## Running the Application

After setting up the database and environment variables, you can run the application:

```
npm run dev
```

## Troubleshooting

If you encounter any issues:

1. Check the console for error messages
2. Verify that the SQL script ran successfully
3. Ensure your environment variables are correct
4. Restart the development server 