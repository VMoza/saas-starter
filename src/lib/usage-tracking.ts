import { createClient } from '@supabase/supabase-js';
import { PRIVATE_SUPABASE_SERVICE_ROLE } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';

// Create a Supabase client with the service role key for admin operations
export const supabaseAdmin = createClient(
  PUBLIC_SUPABASE_URL,
  PRIVATE_SUPABASE_SERVICE_ROLE
);

// Feature types that can be tracked
export type FeatureType = 'essayWrites' | 'collegeSaves';

// Subscription plan types
export type SubscriptionPlan = 'free' | 'plus' | 'pro';

// Response structure for usage queries
export interface UsageResponse {
  allowed: boolean;
  currentUsage: number;
  limit: number;
  remaining: number;
}

// Feature limits by plan
export const featureLimits: Record<FeatureType, Record<SubscriptionPlan, number>> = {
  essayWrites: {
    free: 0,
    plus: 30,
    pro: 100
  },
  collegeSaves: {
    free: 5,
    plus: Infinity,
    pro: Infinity
  }
};

/**
 * Increment usage count for a specific feature
 * @param userId User ID
 * @param featureType Feature being used
 * @returns Success status and error message if applicable
 */
export async function incrementFeatureUsage(userId: string, featureType: FeatureType): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if a record exists for this user and feature
    const { data: existingRecord, error: fetchError } = await supabaseAdmin
      .from('feature_usage')
      .select('*')
      .eq('user_id', userId)
      .eq('feature_type', featureType)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      return { success: false, error: `Error checking usage: ${fetchError.message}` };
    }

    const now = new Date().toISOString();
    
    if (existingRecord) {
      // Update existing record
      const { error: updateError } = await supabaseAdmin
        .from('feature_usage')
        .update({
          count: existingRecord.count + 1,
          updated_at: now
        })
        .eq('id', existingRecord.id);

      if (updateError) {
        return { success: false, error: `Error updating usage: ${updateError.message}` };
      }
    } else {
      // Create new record
      const { error: insertError } = await supabaseAdmin
        .from('feature_usage')
        .insert({
          user_id: userId,
          feature_type: featureType,
          count: 1,
          created_at: now,
          updated_at: now
        });

      if (insertError) {
        return { success: false, error: `Error recording usage: ${insertError.message}` };
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error in incrementFeatureUsage:', error);
    return { success: false, error: 'Unexpected error tracking feature usage' };
  }
}

/**
 * Check if a user can use a specific feature based on their subscription plan
 * @param userId User ID
 * @param featureType Feature to check
 * @param userPlan User's current subscription plan
 * @returns Usage information including if allowed and remaining count
 */
export async function checkFeatureUsage(
  userId: string, 
  featureType: FeatureType, 
  userPlan: SubscriptionPlan
): Promise<UsageResponse> {
  try {
    // Get the limit for this feature based on the user's plan
    const limit = featureLimits[featureType][userPlan];
    
    // If the limit is infinite, the user is always allowed
    if (limit === Infinity) {
      return {
        allowed: true,
        currentUsage: 0,
        limit: Infinity,
        remaining: Infinity
      };
    }

    // If the limit is 0, the user is never allowed
    if (limit === 0) {
      return {
        allowed: false,
        currentUsage: 0,
        limit: 0,
        remaining: 0
      };
    }

    // Get the current usage count
    const { data, error } = await supabaseAdmin
      .from('feature_usage')
      .select('count')
      .eq('user_id', userId)
      .eq('feature_type', featureType)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking feature usage:', error);
      // Default to allowing the feature if there's an error checking
      return {
        allowed: true,
        currentUsage: 0,
        limit,
        remaining: limit
      };
    }

    const currentUsage = data?.count || 0;
    const remaining = Math.max(0, limit - currentUsage);
    const allowed = currentUsage < limit;

    return {
      allowed,
      currentUsage,
      limit,
      remaining
    };
  } catch (error) {
    console.error('Error in checkFeatureUsage:', error);
    // Default to allowing the feature if there's an unexpected error
    return {
      allowed: true,
      currentUsage: 0,
      limit: featureLimits[featureType][userPlan],
      remaining: featureLimits[featureType][userPlan]
    };
  }
} 