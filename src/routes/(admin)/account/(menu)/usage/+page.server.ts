import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getUser } from '$lib/auth';

export const load: PageServerLoad = async ({ locals }) => {
  // Get the authenticated user
  const user = await getUser(locals);
  
  if (!user) {
    throw redirect(302, '/login');
  }
  
  // The actual usage data will be fetched client-side
  return {
    user
  };
}; 