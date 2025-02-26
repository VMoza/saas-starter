import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { checkFeatureUsage } from '$lib/usage-tracking';
import { getUser } from '$lib/auth';

export const GET: RequestHandler = async ({ request, locals }) => {
  try {
    // Get the authenticated user
    const user = await getUser(locals);
    
    if (!user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the user's subscription plan from locals
    const subscriptionInfo = locals.subscriptionInfo;
    const userPlan = subscriptionInfo?.planId || 'free';
    
    // Check the user's feature usage
    const usageData = await checkFeatureUsage(user.id, 'collegeSaves', userPlan);
    
    return json(usageData);
  } catch (error) {
    console.error('Error checking college saves usage:', error);
    return json(
      { 
        error: 'Failed to check feature usage',
        allowed: false,
        currentUsage: 0,
        limit: 0,
        remaining: 0
      }, 
      { status: 500 }
    );
  }
}; 