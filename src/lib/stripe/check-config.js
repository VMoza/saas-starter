import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Load environment variables
const STRIPE_API_KEY = process.env.PRIVATE_STRIPE_API_KEY;
const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.PRIVATE_SUPABASE_SERVICE_ROLE;
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_3UGwSNBAnGz74zs9VBtHmh0uCnuAwMaZ';

// Hardcoded product and price IDs for checking
const PRODUCTS = [
  { name: 'Plus', id: 'prod_RpxAMTArQqEY4v' },
  { name: 'Pro', id: 'prod_RqJ5dDCwfPv1NX' }
];

if (!STRIPE_API_KEY) {
  console.error('Missing Stripe API key. Please check your environment variables.');
  process.exit(1);
}

console.log('Checking Stripe configuration...');

// Create Stripe client
const stripe = new Stripe(STRIPE_API_KEY, { apiVersion: '2023-08-16' });

async function checkStripeConfig() {
  try {
    // Check if the products exist in Stripe
    console.log('Checking products...');
    
    for (const plan of PRODUCTS) {
      try {
        // Check if the product exists
        const product = await stripe.products.retrieve(plan.id);
        console.log(`✅ Product found for ${plan.name} plan: ${product.name} (${product.id})`);
        
        // Get prices for this product
        const prices = await stripe.prices.list({ product: plan.id });
        if (prices.data.length > 0) {
          for (const price of prices.data) {
            const amount = price.unit_amount ? price.unit_amount / 100 : 'N/A';
            console.log(`  ✅ Price found: ${amount} ${price.currency} (${price.id})`);
          }
        } else {
          console.log(`  ❌ No prices found for product ${plan.id}`);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error(`❌ Error checking ${plan.name} plan:`, errorMessage);
        console.log(`   - Product ID: ${plan.id}`);
      }
    }
    
    // Check webhook configuration
    console.log('\nChecking webhook configuration...');
    const webhooks = await stripe.webhookEndpoints.list();
    
    if (webhooks.data.length === 0) {
      console.error('❌ No webhooks configured in Stripe.');
      console.log('   Please set up a webhook endpoint in the Stripe dashboard.');
    } else {
      console.log(`Found ${webhooks.data.length} webhook endpoints:`);
      
      for (const webhook of webhooks.data) {
        console.log(`- ${webhook.url} (${webhook.status})`);
        console.log(`  Events: ${webhook.enabled_events.join(', ')}`);
        
        if (webhook.id === 'we_1Qwce0Hbl2elS2AtQgMy0Uv7') {
          console.log(`  ✅ Found your webhook with ID: ${webhook.id}`);
        }
      }
    }
    
    // Check webhook secret
    console.log('\nChecking webhook secret:');
    if (WEBHOOK_SECRET) {
      console.log(`✅ Webhook secret is set: ${WEBHOOK_SECRET.substring(0, 5)}...`);
    } else {
      console.error('❌ Webhook secret is not set in environment variables');
      console.log('   Please add STRIPE_WEBHOOK_SECRET to your environment variables');
    }
    
    // Check if we can connect to Supabase
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE) {
      console.log('\nChecking Supabase connection...');
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);
      
      const { data, error } = await supabase.from('subscriptions').select('count').limit(1);
      
      if (error) {
        console.error('❌ Error connecting to Supabase:', error.message);
      } else {
        console.log('✅ Successfully connected to Supabase');
      }
    } else {
      console.log('\nSkipping Supabase check (missing credentials)');
    }
    
    console.log('\nConfiguration check complete.');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error checking Stripe configuration:', errorMessage);
  }
}

// Run the check
checkStripeConfig(); 