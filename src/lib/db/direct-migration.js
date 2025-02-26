import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE = process.env.PRIVATE_SUPABASE_SERVICE_ROLE || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  console.error('Missing Supabase credentials. Please check your environment variables.');
  process.exit(1);
}

console.log('Using Supabase URL:', SUPABASE_URL);

// Create Supabase client with service role
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

async function runDirectMigration() {
  try {
    console.log('Running direct SQL migration...');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'direct-migrations.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Split the SQL into statements
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    // Execute each statement
    for (const statement of statements) {
      console.log('Executing SQL statement:', statement.trim().substring(0, 50) + '...');
      
      const { error } = await supabase.rpc('exec_sql', { 
        sql: statement.trim() + ';' 
      });
      
      if (error) {
        console.error('Error executing SQL statement:', error);
        
        // If the function doesn't exist, create it first
        if (error.message.includes('function exec_sql') && error.message.includes('does not exist')) {
          console.log('Creating exec_sql function...');
          
          // Create the exec_sql function
          const createFunctionSql = `
            CREATE OR REPLACE FUNCTION exec_sql(sql text)
            RETURNS void
            LANGUAGE plpgsql
            SECURITY DEFINER
            AS $$
            BEGIN
              EXECUTE sql;
            END;
            $$;
          `;
          
          const { error: functionError } = await supabase.rpc('exec_sql', { 
            sql: createFunctionSql 
          });
          
          if (functionError) {
            console.error('Error creating exec_sql function:', functionError);
            process.exit(1);
          }
          
          // Try again
          const { error: retryError } = await supabase.rpc('exec_sql', { 
            sql: statement.trim() + ';' 
          });
          
          if (retryError) {
            console.error('Error executing SQL statement after retry:', retryError);
          } else {
            console.log('Successfully executed SQL statement after retry');
          }
        }
      } else {
        console.log('Successfully executed SQL statement');
      }
    }
    
    console.log('Direct SQL migration completed.');
  } catch (error) {
    console.error('Error running direct SQL migration:', error);
    process.exit(1);
  }
}

// Run the direct migration
runDirectMigration(); 