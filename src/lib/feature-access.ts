import { redirect } from '@sveltejs/kit';
import type { FeatureType } from './usage-tracking';
import { checkFeatureUsage } from './usage-tracking';
import { getUser } from './auth';

/**
 * Middleware to check if a user has access to a feature
 * @param locals The locals object from the request
 * @param featureType The feature to check access for
 * @param redirectTo Where to redirect if access is denied
 * @returns Whether the user has access to the feature
 */
export async function checkFeatureAccess(
  locals: App.Locals,
  featureType: FeatureType,
  redirectTo: string = '/account/billing'
): Promise<boolean> {
  try {
    // Get the authenticated user
    const user = await getUser(locals);
    
    if (!user) {
      throw redirect(302, '/login');
    }
    
    // Get the user's subscription plan from locals
    const subscriptionInfo = locals.subscriptionInfo;
    const userPlan = subscriptionInfo?.planId || 'free';
    
    // Check if the user has access to the feature
    const usageData = await checkFeatureUsage(user.id, featureType, userPlan);
    
    if (!usageData.allowed) {
      throw redirect(302, redirectTo);
    }
    
    return true;
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    
    console.error('Error checking feature access:', error);
    return false;
  }
}

/**
 * Server load function to check feature access
 * @param locals The locals object from the request
 * @param featureType The feature to check access for
 * @param redirectTo Where to redirect if access is denied
 */
export async function requireFeatureAccess(
  locals: App.Locals,
  featureType: FeatureType,
  redirectTo: string = '/account/billing'
): Promise<void> {
  await checkFeatureAccess(locals, featureType, redirectTo);
} 