import type { FeatureType, UsageResponse } from '../usage-tracking';

/**
 * Track usage of a feature
 * @param featureType The feature being used
 * @returns The updated usage data or error
 */
export async function trackFeatureUsage(featureType: FeatureType): Promise<{
  success: boolean;
  usageData?: UsageResponse;
  error?: string;
}> {
  try {
    const response = await fetch('/api/usage/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ featureType })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to track feature usage',
        usageData: data.usageData
      };
    }

    return {
      success: true,
      usageData: data.usageData
    };
  } catch (error) {
    console.error('Error tracking feature usage:', error);
    return {
      success: false,
      error: 'Failed to track feature usage'
    };
  }
}

/**
 * Get the current usage for a feature
 * @param featureType The feature to check
 * @returns The usage data or error
 */
export async function getFeatureUsage(featureType: FeatureType): Promise<{
  success: boolean;
  usageData?: UsageResponse;
  error?: string;
}> {
  try {
    const response = await fetch(`/api/usage/${featureType}`);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to get feature usage'
      };
    }

    return {
      success: true,
      usageData: data
    };
  } catch (error) {
    console.error('Error getting feature usage:', error);
    return {
      success: false,
      error: 'Failed to get feature usage'
    };
  }
} 