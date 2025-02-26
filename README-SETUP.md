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
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

## Stripe Setup

To properly set up Stripe for payments:

1. **Create Products and Prices in Stripe Dashboard**:
   - Create products that match the plans in `src/routes/(marketing)/pricing/pricing_plans.ts`
   - Create prices for each product and update the `stripe_price_id` and `stripe_product_id` in the pricing_plans.ts file

2. **Configure Webhook Endpoints**:
   - In your Stripe Dashboard, go to Developers > Webhooks
   - Add a new endpoint with the URL: `https://ivy-honor-webapp.pages.dev/api/stripe/webhook`
   - Select the following events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
   - Copy the signing secret and add it to your environment variables as `STRIPE_WEBHOOK_SECRET`

3. **Update Callback URLs**:
   - Make sure the `WebsiteBaseUrl` in `src/config.ts` is set to your production domain: `https://ivy-honor-webapp.pages.dev`
   - This ensures that Stripe redirects to the correct URL after checkout

## Running the Application

After setting up the database, environment variables, and Stripe, you can run the application:

```
npm run dev
```

## Troubleshooting

If you encounter any issues:

1. Check the console for error messages
2. Verify that the SQL script ran successfully
3. Ensure your environment variables are correct
4. Check that your Stripe products and prices match the IDs in your code
5. Verify that your webhook endpoint is correctly configured in Stripe
6. Restart the development server 