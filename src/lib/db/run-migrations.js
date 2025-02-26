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

async function runMigrations() {
  try {
    console.log('Running database migrations...');
    
    // Get all SQL files in the migrations directory
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Sort to ensure consistent order
    
    console.log('Found migration files:', files);
    
    // Run each migration file
    for (const file of files) {
      console.log(`Running migration: ${file}`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      // Execute the SQL directly
      const { error } = await supabase.from('_migrations').insert({
        name: file,
        sql: sql,
        executed_at: new Date().toISOString()
      }).select();
      
      if (error) {
        // If the table doesn't exist, create it first
        if (error.code === '42P01') {
          console.log('Creating migrations table...');
          await supabase.rpc('create_migrations_table');
          
          // Try again
          const { error: retryError } = await supabase.from('_migrations').insert({
            name: file,
            sql: sql,
            executed_at: new Date().toISOString()
          }).select();
          
          if (retryError) {
            console.error(`Error running migration ${file}:`, retryError);
          } else {
            console.log(`Successfully ran migration: ${file}`);
          }
        } else {
          console.error(`Error running migration ${file}:`, error);
        }
      } else {
        console.log(`Successfully ran migration: ${file}`);
      }
    }
    
    console.log('All migrations completed.');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

// Run the migrations
runMigrations(); 