import type { User } from '@supabase/supabase-js';

/**
 * Get the authenticated user from the locals object
 * @param locals The locals object from the request
 * @returns The authenticated user or null
 */
export async function getUser(locals: App.Locals): Promise<User | null> {
  try {
    // Check if the session exists in locals
    const session = locals.session;
    
    if (!session) {
      return null;
    }
    
    return session.user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
} 