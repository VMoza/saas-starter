# Stripe Integration Setup

## What We've Done

1. **Updated Product IDs in Pricing Plans**:
   - Plus tier product ID: `prod_RpxAMTArQqEY4v`
   - Pro tier product ID: `prod_RqJ5dDCwfPv1NX`

2. **Added Webhook Secret to Environment Variables**:
   - Added `STRIPE_WEBHOOK_SECRET=whsec_3UGwSNBAnGz74zs9VBtHmh0uCnuAwMaZ` to `.env.local`

3. **Updated Webhook Handler**:
   - Modified the webhook handler to use the correct webhook secret
   - Added better error logging

4. **Created SQL Script for Subscriptions Table**:
   - Created `src/lib/db/create-subscriptions-table.sql` to be run in the Supabase dashboard

5. **Fixed Checkout Session Creation**:
   - Updated the checkout session creation to use the correct base URL
   - Added better error handling and logging

## What You Need to Do

1. **Run the SQL Script in Supabase**:
   - Log in to your Supabase dashboard
   - Go to the SQL Editor
   - Create a new query
   - Copy and paste the contents of `src/lib/db/create-subscriptions-table.sql`
   - Run the query

2. **Verify Stripe Configuration**:
   - Run `npm run stripe:check` to verify that your Stripe configuration is correct
   - Make sure the products and prices are correctly set up
   - Ensure the webhook endpoint is configured correctly

3. **Deploy Your Changes**:
   - Deploy your changes to your production environment
   - Make sure the environment variables are set correctly in your production environment

4. **Test the Checkout Process**:
   - Try subscribing to a plan
   - Check that the webhook events are being received and processed correctly
   - Verify that the subscription is being created in your database

## Troubleshooting

If you encounter any issues:

1. **Check the Logs**:
   - Look for error messages in the console
   - Check the Stripe dashboard for webhook events and errors

2. **Verify Environment Variables**:
   - Make sure all required environment variables are set correctly
   - Double-check the webhook secret

3. **Test Webhook Endpoint**:
   - Use the Stripe CLI to test your webhook endpoint
   - Check that the webhook events are being received and processed correctly

4. **Check Database Tables**:
   - Verify that the subscriptions table exists and has the correct structure
   - Check that the RLS policies are set up correctly 