import type { SupabaseClient } from "@supabase/supabase-js";
import { pricingPlans } from "../routes/(marketing)/pricing/pricing_plans";

/**
 * Subscription status types
 */
export type SubscriptionStatus = 'free' | 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete' | 'incomplete_expired';

/**
 * Subscription plan types
 */
export type SubscriptionPlan = 'free' | 'pro' | 'enterprise';

/**
 * Subscription information
 */
export interface SubscriptionInfo {
  status: SubscriptionStatus;
  planId: SubscriptionPlan;
  isActive: boolean;
  subscriptionId?: string;
  currentPeriodEnd?: string;
}

/**
 * Check if a user has access to a specific feature based on their subscription plan
 */
export function hasFeatureAccess(
  userPlanId: string,
  requiredPlanLevel: 'free' | 'pro' | 'enterprise'
): boolean {
  // Plan hierarchy: free < pro < enterprise
  const planLevels = {
    free: 0,
    pro: 1,
    enterprise: 2
  };

  // If the user's plan level is greater than or equal to the required level, they have access
  return planLevels[userPlanId as keyof typeof planLevels] >= planLevels[requiredPlanLevel];
}

/**
 * Get a user's subscription information from the database
 */
export async function getUserSubscription(
  supabase: SupabaseClient,
  userId: string
): Promise<SubscriptionInfo> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      // If no subscription found, return free plan status
      if (error.code === 'PGRST116') {
        return {
          status: 'free',
          planId: 'free',
          isActive: true
        };
      }
      console.error('Error fetching subscription:', error);
      return {
        status: 'free',
        planId: 'free',
        isActive: true
      };
    }

    // Find the plan based on the price ID
    let planId: SubscriptionPlan = 'free';
    if (data.price_id) {
      const plan = pricingPlans.find(p => p.stripe_price_id === data.price_id);
      if (plan) {
        planId = plan.id as SubscriptionPlan;
      }
    }

    // Check if subscription is active
    const isActive = ['active', 'trialing'].includes(data.status);

    return {
      status: data.status as SubscriptionStatus,
      planId,
      isActive,
      subscriptionId: data.stripe_subscription_id,
      currentPeriodEnd: data.current_period_end
    };
  } catch (error) {
    console.error('Error in getUserSubscription:', error);
    return {
      status: 'free',
      planId: 'free',
      isActive: true
    };
  }
}

/**
 * Check if a user has access to a specific feature
 */
export async function checkFeatureAccess(
  supabase: SupabaseClient,
  userId: string,
  requiredPlanLevel: 'free' | 'pro' | 'enterprise'
): Promise<boolean> {
  const subscription = await getUserSubscription(supabase, userId);
  
  // If subscription is not active and not free, deny access
  if (!subscription.isActive && subscription.planId !== 'free') {
    return requiredPlanLevel === 'free';
  }
  
  return hasFeatureAccess(subscription.planId, requiredPlanLevel);
}

/**
 * Get the usage limits for a specific plan
 */
export function getPlanLimits(planId: SubscriptionPlan): {
  essayWrites: number;
  collegeSaves: number;
} {
  switch (planId) {
    case 'pro':
      return {
        essayWrites: 30,
        collegeSaves: Infinity
      };
    case 'enterprise':
      return {
        essayWrites: 100,
        collegeSaves: Infinity
      };
    case 'free':
    default:
      return {
        essayWrites: 0,
        collegeSaves: 5
      };
  }
} 