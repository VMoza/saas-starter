import { PRIVATE_STRIPE_API_KEY } from "$env/static/private";
import { json } from "@sveltejs/kit";
import Stripe from "stripe";
import type { RequestEvent } from "@sveltejs/kit";

const stripe = new Stripe(PRIVATE_STRIPE_API_KEY, { apiVersion: "2023-08-16" });

// Webhook handler for Stripe events
export const POST = async ({ request, locals }: RequestEvent) => {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const { supabaseServiceRole } = locals;

  if (!signature) {
    console.error("Missing Stripe signature");
    return json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    // Get the webhook secret from environment variables or use the hardcoded one
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_3UGwSNBAnGz74zs9VBtHmh0uCnuAwMaZ";
    console.log("Using webhook secret:", webhookSecret ? "Secret is set" : "No secret found");
    
    // Verify the event came from Stripe
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
    
    console.log("Webhook event verified successfully:", event.type);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err}`);
    return json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle the event
  try {
    console.log(`Processing webhook event: ${event.type}`);
    
    switch (event.type) {
      case "checkout.session.completed":
        // Payment is successful and the subscription is created
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        console.log("Checkout session completed:", checkoutSession.id);
        await handleCheckoutSessionCompleted(checkoutSession, supabaseServiceRole);
        break;

      case "customer.subscription.created":
        // Subscription created
        const subscriptionCreated = event.data.object as Stripe.Subscription;
        console.log("Subscription created:", subscriptionCreated.id);
        await handleSubscriptionCreated(subscriptionCreated, supabaseServiceRole);
        break;

      case "customer.subscription.updated":
        // Subscription updated (e.g., plan change, renewal)
        const subscriptionUpdated = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscriptionUpdated, supabaseServiceRole);
        break;

      case "customer.subscription.deleted":
        // Subscription canceled or expired
        const subscriptionDeleted = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscriptionDeleted, supabaseServiceRole);
        break;

      case "invoice.payment_succeeded":
        // Invoice payment succeeded
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice, supabaseServiceRole);
        break;

      case "invoice.payment_failed":
        // Invoice payment failed
        const failedInvoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(failedInvoice, supabaseServiceRole);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error(`Error processing webhook: ${error}`);
    return json({ error: "Webhook processing failed" }, { status: 500 });
  }

  // Return a 200 response to acknowledge receipt of the event
  return json({ received: true });
};

// Helper functions to handle different webhook events

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
  supabaseServiceRole: any
) {
  // Get customer ID from the session
  const customerId = session.customer as string;
  
  // Find the user associated with this Stripe customer
  const { data: users, error } = await supabaseServiceRole
    .from("users")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .limit(1);

  if (error || !users || users.length === 0) {
    console.error("Error finding user for customer", error);
    return;
  }

  const userId = users[0].id;

  // Update user's subscription status
  await supabaseServiceRole
    .from("user_subscriptions")
    .upsert({
      user_id: userId,
      stripe_subscription_id: session.subscription as string,
      status: "active",
      updated_at: new Date().toISOString()
    });
}

async function handleSubscriptionCreated(
  subscription: Stripe.Subscription,
  supabaseServiceRole: any
) {
  // Get customer ID from the subscription
  const customerId = subscription.customer as string;
  
  // Find the user associated with this Stripe customer
  const { data: users, error } = await supabaseServiceRole
    .from("users")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .limit(1);

  if (error || !users || users.length === 0) {
    console.error("Error finding user for customer", error);
    return;
  }

  const userId = users[0].id;

  // Get the price ID to determine the plan
  const priceId = subscription.items.data[0].price.id;

  // Update user's subscription status
  await supabaseServiceRole
    .from("user_subscriptions")
    .upsert({
      user_id: userId,
      stripe_subscription_id: subscription.id,
      stripe_price_id: priceId,
      status: subscription.status,
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString()
    });
}

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
  supabaseServiceRole: any
) {
  // Similar to subscription created, but for updates
  const customerId = subscription.customer as string;
  
  const { data: users, error } = await supabaseServiceRole
    .from("users")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .limit(1);

  if (error || !users || users.length === 0) {
    console.error("Error finding user for customer", error);
    return;
  }

  const userId = users[0].id;
  const priceId = subscription.items.data[0].price.id;

  await supabaseServiceRole
    .from("user_subscriptions")
    .upsert({
      user_id: userId,
      stripe_subscription_id: subscription.id,
      stripe_price_id: priceId,
      status: subscription.status,
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString()
    });
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  supabaseServiceRole: any
) {
  // Update subscription status to canceled
  const customerId = subscription.customer as string;
  
  const { data: users, error } = await supabaseServiceRole
    .from("users")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .limit(1);

  if (error || !users || users.length === 0) {
    console.error("Error finding user for customer", error);
    return;
  }

  const userId = users[0].id;

  await supabaseServiceRole
    .from("user_subscriptions")
    .upsert({
      user_id: userId,
      stripe_subscription_id: subscription.id,
      status: "canceled",
      updated_at: new Date().toISOString()
    });
}

async function handleInvoicePaymentSucceeded(
  invoice: Stripe.Invoice,
  supabaseServiceRole: any
) {
  // Update subscription status if needed
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
    await handleSubscriptionUpdated(subscription, supabaseServiceRole);
  }
}

async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice,
  supabaseServiceRole: any
) {
  // Handle failed payment - mark subscription as past_due
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
    
    const customerId = subscription.customer as string;
    
    const { data: users, error } = await supabaseServiceRole
      .from("users")
      .select("id")
      .eq("stripe_customer_id", customerId)
      .limit(1);

    if (error || !users || users.length === 0) {
      console.error("Error finding user for customer", error);
      return;
    }

    const userId = users[0].id;

    await supabaseServiceRole
      .from("user_subscriptions")
      .upsert({
        user_id: userId,
        stripe_subscription_id: subscription.id,
        status: "past_due",
        updated_at: new Date().toISOString()
      });
  }
} 