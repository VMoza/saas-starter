import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { incrementFeatureUsage, checkFeatureUsage, type FeatureType } from '$lib/usage-tracking';
import { getUser } from '$lib/auth';

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    // Get the authenticated user
    const user = await getUser(locals);
    
    if (!user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the feature type from the request body
    const body = await request.json();
    const { featureType } = body as { featureType: FeatureType };
    
    if (!featureType) {
      return json({ error: 'Feature type is required' }, { status: 400 });
    }
    
    // Get the user's subscription plan from locals
    const subscriptionInfo = locals.subscriptionInfo;
    const userPlan = subscriptionInfo?.planId || 'free';
    
    // First check if the user is allowed to use this feature
    const usageCheck = await checkFeatureUsage(user.id, featureType, userPlan);
    
    if (!usageCheck.allowed) {
      return json({
        success: false,
        error: 'Usage limit reached',
        usageData: usageCheck
      }, { status: 403 });
    }
    
    // If allowed, increment the usage
    const result = await incrementFeatureUsage(user.id, featureType);
    
    if (!result.success) {
      return json({
        success: false,
        error: result.error || 'Failed to track usage',
        usageData: usageCheck
      }, { status: 500 });
    }
    
    // Return the updated usage data
    const updatedUsage = {
      ...usageCheck,
      currentUsage: usageCheck.currentUsage + 1,
      remaining: Math.max(0, usageCheck.remaining - 1)
    };
    
    return json({
      success: true,
      usageData: updatedUsage
    });
  } catch (error) {
    console.error('Error tracking feature usage:', error);
    return json({ 
      success: false,
      error: 'Failed to track feature usage' 
    }, { status: 500 });
  }
}; 