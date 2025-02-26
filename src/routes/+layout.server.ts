import { getUserSubscription } from '$lib/subscription';
import type { SupabaseClient } from '@supabase/supabase-js';

export const load = async ({ locals }: { locals: { 
  safeGetSession: () => Promise<any>,
  supabase: SupabaseClient
}}) => {
  const { session, user } = await locals.safeGetSession();
  
  // If user is logged in, get their subscription information
  let subscriptionInfo = null;
  if (session?.user) {
    subscriptionInfo = await getUserSubscription(locals.supabase, session.user.id);
  }
  
  return {
    session,
    user: user || null,
    subscriptionInfo
  };
}; 