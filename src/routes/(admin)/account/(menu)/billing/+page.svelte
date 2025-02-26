<script lang="ts">
  import { page } from "$app/stores"
  import { pricingPlans } from "../../../../(marketing)/pricing/pricing_plans"
  import PricingModule from "../../../../(marketing)/pricing/pricing_module.svelte"

  // Get the current plan information from the page data
  const { isActiveCustomer, hasEverHadSubscription, currentPlanId } = $page.data

  // Find the current plan details
  const currentPlan = pricingPlans.find((p) => p.id === currentPlanId)
</script>

<svelte:head>
  <title>Billing Management</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="flex flex-col gap-8">
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-2xl">Subscription Status</h2>

        <div class="mt-4">
          {#if isActiveCustomer}
            <div class="alert alert-success shadow-lg">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="stroke-current flex-shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  ><path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  /></svg
                >
                <div>
                  <span class="font-bold">Active Subscription:</span> You're
                  currently on the {currentPlan?.name || "Free"} plan.
                </div>
              </div>
            </div>

            <div class="mt-6 flex flex-col sm:flex-row gap-4">
              <a href="/account/(menu)/billing/manage" class="btn btn-primary">
                Manage Subscription
              </a>
              <a
                href="/account/(menu)/billing/invoices"
                class="btn btn-outline"
              >
                View Invoices
              </a>
            </div>
          {:else if hasEverHadSubscription}
            <div class="alert alert-warning shadow-lg">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="stroke-current flex-shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  ><path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  /></svg
                >
                <div>
                  <span class="font-bold">Inactive Subscription:</span> Your subscription
                  has expired or been canceled.
                </div>
              </div>
            </div>

            <p class="mt-4">
              Choose a plan below to reactivate your subscription:
            </p>
          {:else}
            <div class="alert shadow-lg">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  class="stroke-info flex-shrink-0 w-6 h-6"
                  ><path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path></svg
                >
                <div>
                  <span class="font-bold">No Subscription:</span> You're currently
                  on the Free plan.
                </div>
              </div>
            </div>

            <p class="mt-4">Choose a plan below to upgrade your account:</p>
          {/if}
        </div>
      </div>
    </div>

    {#if !isActiveCustomer}
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-2xl mb-4">Available Plans</h2>
          <PricingModule
            callToAction="Subscribe"
            highlightedPlanId="pro"
            {currentPlanId}
            center={false}
          />
        </div>
      </div>
    {/if}

    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-2xl">Billing FAQ</h2>

        <div class="join join-vertical w-full mt-4">
          <div class="collapse collapse-arrow join-item border border-base-300">
            <input type="radio" name="billing-faq" checked />
            <div class="collapse-title text-lg font-medium">
              How do I cancel my subscription?
            </div>
            <div class="collapse-content">
              <p>
                You can cancel your subscription at any time by clicking the
                "Manage Subscription" button above. This will take you to the
                Stripe Customer Portal where you can cancel your subscription.
              </p>
              <p class="mt-2">
                After cancellation, you'll continue to have access to your paid
                features until the end of your current billing period.
              </p>
            </div>
          </div>

          <div class="collapse collapse-arrow join-item border border-base-300">
            <input type="radio" name="billing-faq" />
            <div class="collapse-title text-lg font-medium">
              Can I change my plan?
            </div>
            <div class="collapse-content">
              <p>
                Yes, you can upgrade or downgrade your plan at any time. To
                change your plan, click the "Manage Subscription" button above
                and select a different plan.
              </p>
              <p class="mt-2">
                When upgrading, the change takes effect immediately. When
                downgrading, the change will take effect at the end of your
                current billing period.
              </p>
            </div>
          </div>

          <div class="collapse collapse-arrow join-item border border-base-300">
            <input type="radio" name="billing-faq" />
            <div class="collapse-title text-lg font-medium">
              How secure is my payment information?
            </div>
            <div class="collapse-content">
              <p>
                We use Stripe for payment processing, which is PCI compliant and
                uses industry-standard encryption to protect your payment
                information. We never store your credit card details on our
                servers.
              </p>
            </div>
          </div>

          <div class="collapse collapse-arrow join-item border border-base-300">
            <input type="radio" name="billing-faq" />
            <div class="collapse-title text-lg font-medium">
              What happens if I have billing issues?
            </div>
            <div class="collapse-content">
              <p>
                If you encounter any billing issues, please contact our support
                team at support@ivyhonor.com. We'll be happy to assist you with
                any billing-related questions or concerns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
