import { PRIVATE_STRIPE_API_KEY } from "$env/static/private"
import { error, redirect } from "@sveltejs/kit"
import Stripe from "stripe"
import {
  fetchSubscription,
  getOrCreateCustomerId,
} from "../../subscription_helpers.server"
import type { PageServerLoad } from "./$types"
import { WebsiteBaseUrl } from "../../../../../config"

const stripe = new Stripe(PRIVATE_STRIPE_API_KEY, { apiVersion: "2023-08-16" })

export const load: PageServerLoad = async ({
  params,
  url,
  locals: { safeGetSession, supabaseServiceRole },
}) => {
  const { session, user } = await safeGetSession()
  if (!session) {
    redirect(303, "/login")
  }

  if (params.slug === "free_plan") {
    // plan with no stripe_price_id. Redirect to account home
    redirect(303, "/account")
  }

  console.log("Creating checkout session for price ID:", params.slug);

  const { error: idError, customerId } = await getOrCreateCustomerId({
    supabaseServiceRole,
    user,
  })
  if (idError || !customerId) {
    console.error("Error creating customer id", idError)
    error(500, {
      message: "Unknown error. If issue persists, please contact us.",
    })
  }

  console.log("Customer ID:", customerId);

  const { primarySubscription } = await fetchSubscription({
    customerId,
  })
  if (primarySubscription) {
    // User already has plan, we shouldn't let them buy another
    redirect(303, "/account/billing")
  }

  // Use the WebsiteBaseUrl from config instead of url.origin to ensure consistency
  const baseUrl = WebsiteBaseUrl || url.origin;
  console.log("Using base URL for redirects:", baseUrl);

  let checkoutUrl
  try {
    const stripeSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: params.slug,
          quantity: 1,
        },
      ],
      customer: customerId,
      mode: "subscription",
      success_url: `${baseUrl}/account`,
      cancel_url: `${baseUrl}/account/billing`,
      // Add automatic tax calculation
      automatic_tax: { enabled: true },
      // Add customer email for better UX
      customer_email: user.email,
      // Add billing address collection
      billing_address_collection: 'required',
      // Allow promotion codes
      allow_promotion_codes: true,
    })
    
    console.log("Checkout session created successfully, redirecting to:", stripeSession.url);
    checkoutUrl = stripeSession.url
  } catch (e) {
    console.error("Error creating checkout session", e)
    // Provide more detailed error message
    if (e instanceof Stripe.errors.StripeError) {
      console.error("Stripe error details:", e.message);
      error(500, `Stripe Error: ${e.message}. Please contact support.`);
    }
    error(500, "Unknown Error (SSE): If issue persists please contact us.")
  }

  if (!checkoutUrl) {
    console.error("Checkout URL is undefined");
    error(500, "Failed to create checkout session. Please try again later.");
  }

  redirect(303, checkoutUrl)
}
