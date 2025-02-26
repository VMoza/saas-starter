import { redirect } from '@sveltejs/kit';
import type { SupabaseClient } from '@supabase/supabase-js';
import { checkFeatureAccess } from '$lib/subscription';
import type { SubscriptionPlan } from '$lib/subscription';

/**
 * Middleware to check if a user has access to a feature based on their subscription
 * 
 * @param locals The locals object from the request
 * @param requiredPlan The minimum plan level required to access the feature
 * @param redirectTo Where to redirect if access is denied
 */
export async function requireSubscription(
  locals: { 
    getSession: () => Promise<any>,
    supabase: SupabaseClient
  },
  requiredPlan: SubscriptionPlan = 'pro',
  redirectTo: string = '/account/billing'
): Promise<void> {
  const session = await locals.getSession();
  
  // If not logged in, redirect to login
  if (!session?.user) {
    redirect(303, `/login/sign_in?redirectTo=${encodeURIComponent(redirectTo)}`);
  }
  
  // Check if user has access to the feature
  const hasAccess = await checkFeatureAccess(
    locals.supabase,
    session.user.id,
    requiredPlan
  );
  
  // If no access, redirect to billing page
  if (!hasAccess) {
    redirect(303, redirectTo);
  }
} 