import { error, redirect } from "@sveltejs/kit"
import {
  fetchSubscription,
  getOrCreateCustomerId,
} from "../../subscription_helpers.server"
import type { PageServerLoad } from "./$types"
import { defaultPlanId } from "../../../../(marketing)/pricing/pricing_plans"

export const load: PageServerLoad = async ({
  locals: { safeGetSession, supabaseServiceRole },
}) => {
  try {
    const { session, user } = await safeGetSession()
    if (!session || !user?.id) {
      redirect(303, "/login")
    }

    try {
      const { error: idError, customerId } = await getOrCreateCustomerId({
        supabaseServiceRole,
        user,
      })
      
      if (idError) {
        console.error("Error creating customer id", idError)
        // Return default values instead of throwing an error
        return {
          isActiveCustomer: false,
          hasEverHadSubscription: false,
          currentPlanId: defaultPlanId,
        }
      }

      if (!customerId) {
        console.error("No customer ID returned")
        // Return default values
        return {
          isActiveCustomer: false,
          hasEverHadSubscription: false,
          currentPlanId: defaultPlanId,
        }
      }

      try {
        const {
          primarySubscription,
          hasEverHadSubscription,
          error: fetchErr,
        } = await fetchSubscription({
          customerId,
        })
        
        if (fetchErr) {
          console.error("Error fetching subscription", fetchErr)
          // Return default values with customer info
          return {
            isActiveCustomer: false,
            hasEverHadSubscription: false,
            currentPlanId: defaultPlanId,
          }
        }

        return {
          isActiveCustomer: !!primarySubscription,
          hasEverHadSubscription: hasEverHadSubscription || false,
          currentPlanId: primarySubscription?.appSubscription?.id || defaultPlanId,
        }
      } catch (subscriptionError) {
        console.error("Error in subscription fetch", subscriptionError)
        // Return default values
        return {
          isActiveCustomer: false,
          hasEverHadSubscription: false,
          currentPlanId: defaultPlanId,
        }
      }
    } catch (customerError) {
      console.error("Error in customer ID process", customerError)
      // Return default values
      return {
        isActiveCustomer: false,
        hasEverHadSubscription: false,
        currentPlanId: defaultPlanId,
      }
    }
  } catch (sessionError) {
    console.error("Session error", sessionError)
    // Redirect to login if there's a session error
    redirect(303, "/login")
  }
}
