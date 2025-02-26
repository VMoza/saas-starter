# Stripe Integration Setup

This directory contains the webhook handlers for Stripe events. These webhooks are essential for properly managing subscriptions and payments in the application.

## Setting Up Stripe Webhooks

1. **Create a Stripe Account**: If you haven't already, sign up for a Stripe account at [stripe.com](https://stripe.com).

2. **Set Up Products and Prices**:
   - Create products in your Stripe dashboard that match the plans in `src/routes/(marketing)/pricing/pricing_plans.ts`
   - Create prices for each product and update the `stripe_price_id` and `stripe_product_id` in the pricing_plans.ts file

3. **Configure Webhook Endpoints**:
   - In your Stripe Dashboard, go to Developers > Webhooks
   - Add a new endpoint with the URL: `https://your-domain.com/api/stripe/webhook`
   - Select the following events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

4. **Set Webhook Secret**:
   - After creating the webhook, Stripe will provide a signing secret
   - Add this secret to your environment variables as `STRIPE_WEBHOOK_SECRET`
   - For local development, you can use Stripe CLI to forward events to your local server

## Local Development with Stripe CLI

1. **Install Stripe CLI**: Follow the instructions at [Stripe CLI Installation](https://stripe.com/docs/stripe-cli)

2. **Login to Stripe CLI**:
   ```
   stripe login
   ```

3. **Forward Events to Your Local Server**:
   ```
   stripe listen --forward-to http://localhost:5173/api/stripe/webhook
   ```

4. **Use the Webhook Secret**:
   The Stripe CLI will provide a webhook secret. Add this to your `.env.local` file:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_secret_key
   ```

## Testing Webhooks

You can trigger test webhook events using the Stripe CLI:

```
stripe trigger checkout.session.completed
stripe trigger customer.subscription.created
stripe trigger customer.subscription.updated
stripe trigger customer.subscription.deleted
stripe trigger invoice.payment_succeeded
stripe trigger invoice.payment_failed
```

## Database Schema

The webhook handlers interact with the following database tables:

1. **stripe_customers**: Links Stripe customer IDs to user IDs
2. **user_subscriptions**: Stores subscription information for users

Make sure these tables are created in your database. You can find the migration file at `src/lib/db/migrations/user_subscriptions.sql`.

## Troubleshooting

- **Webhook Errors**: Check the server logs for detailed error messages
- **Missing Events**: Verify that you've selected all the necessary events in the Stripe Dashboard
- **Authentication Issues**: Ensure your Stripe API keys are correctly set in your environment variables
- **Database Errors**: Verify that the database tables exist and have the correct schema 