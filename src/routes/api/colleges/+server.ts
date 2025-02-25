import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PRIVATE_SUPABASE_SERVICE_ROLE } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../../DatabaseDefinitions';

// Create a Supabase client with the service role key for admin access
const supabase = createClient<Database>(
  PUBLIC_SUPABASE_URL,
  PRIVATE_SUPABASE_SERVICE_ROLE
);

// GET handler to fetch all colleges for the current user
export const GET: RequestHandler = async ({ locals }) => {
  try {
    const { session } = await locals.safeGetSession();
    
    if (!session) {
      return json({ error: 'Unauthorized', colleges: [] }, { status: 401 });
    }
    
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .eq('user_id', session.user.id)
        .order('id');
        
      if (error) {
        // Check if the error is because the table doesn't exist
        if (error.message.includes('does not exist') || error.code === '42P01') {
          console.warn('Colleges table does not exist yet');
          return json({ 
            warning: 'Colleges table does not exist yet. Please run the migration.',
            colleges: [] 
          });
        }
        
        console.error('Error fetching colleges:', error);
        return json({ 
          error: `Failed to fetch colleges: ${error.message}`, 
          colleges: [] 
        }, { status: 500 });
      }
      
      return json({ colleges: data });
    } catch (queryErr) {
      console.error('Error querying colleges table:', queryErr);
      return json({ 
        error: 'Error querying colleges table', 
        colleges: [] 
      }, { status: 500 });
    }
  } catch (err) {
    console.error('Unexpected error in GET /api/colleges:', err);
    return json({ 
      error: `Unexpected error: ${err instanceof Error ? err.message : String(err)}`,
      colleges: [] 
    }, { status: 500 });
  }
};

// POST handler to save colleges
export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const { session } = await locals.safeGetSession();
    
    if (!session) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const colleges = await request.json();
    
    // Add user_id to each college entry
    const collegesWithUserId = colleges.map((college: any) => ({
      ...college,
      user_id: session.user.id
    }));
    
    try {
      // Upsert the colleges (insert or update)
      const { data, error } = await supabase
        .from('colleges')
        .upsert(collegesWithUserId, { onConflict: 'id' })
        .select();
        
      if (error) {
        // Check if the error is because the table doesn't exist
        if (error.message.includes('does not exist') || error.code === '42P01') {
          return json({ 
            warning: 'Colleges table does not exist yet. Please run the migration.',
            colleges: [] 
          });
        }
        
        console.error('Error saving colleges:', error);
        return json({ error: `Failed to save colleges: ${error.message}` }, { status: 500 });
      }
      
      return json({ success: true, colleges: data });
    } catch (queryErr) {
      console.error('Error saving to colleges table:', queryErr);
      return json({ error: 'Error saving to colleges table' }, { status: 500 });
    }
  } catch (err) {
    console.error('Unexpected error in POST /api/colleges:', err);
    return json({ 
      error: `Unexpected error: ${err instanceof Error ? err.message : String(err)}`
    }, { status: 500 });
  }
};

// DELETE handler to delete a college
export const DELETE: RequestHandler = async ({ url, locals }) => {
  try {
    const { session } = await locals.safeGetSession();
    
    if (!session) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const id = url.searchParams.get('id');
    
    if (!id) {
      return json({ error: 'College ID is required' }, { status: 400 });
    }
    
    try {
      // Delete the college, ensuring it belongs to the current user
      const { error } = await supabase
        .from('colleges')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id);
        
      if (error) {
        // Check if the error is because the table doesn't exist
        if (error.message.includes('does not exist') || error.code === '42P01') {
          return json({ 
            warning: 'Colleges table does not exist yet. Please run the migration.'
          });
        }
        
        console.error('Error deleting college:', error);
        return json({ error: `Failed to delete college: ${error.message}` }, { status: 500 });
      }
      
      return json({ success: true });
    } catch (queryErr) {
      console.error('Error deleting from colleges table:', queryErr);
      return json({ error: 'Error deleting from colleges table' }, { status: 500 });
    }
  } catch (err) {
    console.error('Unexpected error in DELETE /api/colleges:', err);
    return json({ 
      error: `Unexpected error: ${err instanceof Error ? err.message : String(err)}`
    }, { status: 500 });
  }
}; 