import type { SupabaseClient, User } from "@supabase/supabase-js"
import type { Database } from "../../../DatabaseDefinitions"

import { PRIVATE_STRIPE_API_KEY } from "$env/static/private"
import Stripe from "stripe"
import { pricingPlans } from "../../(marketing)/pricing/pricing_plans"
const stripe = new Stripe(PRIVATE_STRIPE_API_KEY, { apiVersion: "2023-08-16" })

export const getOrCreateCustomerId = async ({
  supabaseServiceRole,
  user,
}: {
  supabaseServiceRole: SupabaseClient<Database>
  user: User
}) => {
  const { data: dbCustomer, error } = await supabaseServiceRole
    .from("stripe_customers")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single()

  if (error && error.code != "PGRST116") {
    // PGRST116 == no rows
    return { error: error }
  }

  if (dbCustomer?.stripe_customer_id) {
    return { customerId: dbCustomer.stripe_customer_id }
  }

  // Fetch data needed to create customer
  const { data: profile, error: profileError } = await supabaseServiceRole
    .from("profiles")
    .select(`full_name, website, company_name`)
    .eq("id", user.id)
    .single()
  if (profileError) {
    return { error: profileError }
  }

  // Create a stripe customer
  let customer
  try {
    customer = await stripe.customers.create({
      email: user.email,
      name: profile.full_name ?? "",
      metadata: {
        user_id: user.id,
        company_name: profile.company_name ?? "",
        website: profile.website ?? "",
      },
    })
  } catch (e) {
    return { error: e }
  }

  if (!customer.id) {
    return { error: "Unknown stripe user creation error" }
  }

  // insert instead of upsert so we never over-write. PK ensures later attempts error.
  const { error: insertError } = await supabaseServiceRole
    .from("stripe_customers")
    .insert({
      user_id: user.id,
      stripe_customer_id: customer.id,
      updated_at: new Date(),
    })

  if (insertError) {
    return { error: insertError }
  }

  return { customerId: customer.id }
}

export const fetchSubscription = async ({
  customerId,
}: {
  customerId: string
}) => {
  // Fetch user's subscriptions
  let stripeSubscriptions
  try {
    stripeSubscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 100,
      status: "all",
    })
  } catch (e) {
    return { error: e }
  }

  // find "primary". The user may have several old ones, we want an active one (including trials, and past_due in grace period).
  const primaryStripeSubscription = stripeSubscriptions.data.find((x) => {
    return (
      x.status === "active" ||
      x.status === "trialing" ||
      x.status === "past_due"
    )
  })
  let appSubscription = null
  if (primaryStripeSubscription) {
    const productId =
      primaryStripeSubscription?.items?.data?.[0]?.price.product ?? ""
    appSubscription = pricingPlans.find((x) => {
      return x.stripe_product_id === productId
    })
    if (!appSubscription) {
      return {
        error:
          "Stripe subscription does not have matching app subscription in pricing_plans.ts (via product id match)",
      }
    }
  }
  let primarySubscription = null
  if (primaryStripeSubscription && appSubscription) {
    primarySubscription = {
      stripeSubscription: primaryStripeSubscription,
      appSubscription: appSubscription,
    }
  }

  const hasEverHadSubscription = stripeSubscriptions.data.length > 0

  return {
    primarySubscription,
    hasEverHadSubscription,
  }
}

// New helper functions for subscription management

/**
 * Updates the user's subscription status in the database
 */
export const updateSubscriptionStatus = async ({
  supabaseServiceRole,
  userId,
  subscriptionId,
  priceId,
  status,
  currentPeriodEnd,
}: {
  supabaseServiceRole: SupabaseClient<Database>
  userId: string
  subscriptionId: string
  priceId?: string
  status: string
  currentPeriodEnd?: Date
}) => {
  try {
    const subscriptionData: any = {
      user_id: userId,
      stripe_subscription_id: subscriptionId,
      status,
      updated_at: new Date().toISOString(),
    };

    if (priceId) {
      subscriptionData.stripe_price_id = priceId;
    }

    if (currentPeriodEnd) {
      subscriptionData.current_period_end = currentPeriodEnd.toISOString();
    }

    const { error } = await supabaseServiceRole
      .from("user_subscriptions")
      .upsert(subscriptionData);

    if (error) {
      console.error("Error updating subscription status:", error);
      return { error };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in updateSubscriptionStatus:", error);
    return { error };
  }
}

/**
 * Cancels a user's subscription at the end of the current billing period
 */
export const cancelSubscription = async ({
  subscriptionId,
}: {
  subscriptionId: string
}) => {
  try {
    const canceledSubscription = await stripe.subscriptions.update(
      subscriptionId,
      { cancel_at_period_end: true }
    );
    
    return { 
      success: true, 
      canceledSubscription 
    };
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return { error };
  }
}

/**
 * Reactivates a subscription that was set to cancel at period end
 */
export const reactivateSubscription = async ({
  subscriptionId,
}: {
  subscriptionId: string
}) => {
  try {
    const reactivatedSubscription = await stripe.subscriptions.update(
      subscriptionId,
      { cancel_at_period_end: false }
    );
    
    return { 
      success: true, 
      reactivatedSubscription 
    };
  } catch (error) {
    console.error("Error reactivating subscription:", error);
    return { error };
  }
}

/**
 * Changes a user's subscription to a different plan
 */
export const changePlan = async ({
  subscriptionId,
  newPriceId,
}: {
  subscriptionId: string
  newPriceId: string
}) => {
  try {
    const updatedSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        items: [
          {
            id: (await stripe.subscriptions.retrieve(subscriptionId)).items.data[0].id,
            price: newPriceId,
          },
        ],
      }
    );
    
    return { 
      success: true, 
      updatedSubscription 
    };
  } catch (error) {
    console.error("Error changing subscription plan:", error);
    return { error };
  }
}

/**
 * Gets the subscription status for a user
 */
export const getUserSubscriptionStatus = async ({
  supabaseServiceRole,
  userId,
}: {
  supabaseServiceRole: SupabaseClient<Database>
  userId: string
}) => {
  try {
    const { data, error } = await supabaseServiceRole
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      // If no subscription found, return free plan status
      if (error.code === "PGRST116") {
        return { 
          status: "free",
          planId: "free"
        };
      }
      return { error };
    }

    // Find the plan based on the price ID
    let planId = "free";
    if (data.stripe_price_id) {
      const plan = pricingPlans.find(p => p.stripe_price_id === data.stripe_price_id);
      if (plan) {
        planId = plan.id;
      }
    }

    return {
      status: data.status,
      planId,
      subscriptionId: data.stripe_subscription_id,
      currentPeriodEnd: data.current_period_end,
    };
  } catch (error) {
    console.error("Error getting user subscription status:", error);
    return { error };
  }
}
