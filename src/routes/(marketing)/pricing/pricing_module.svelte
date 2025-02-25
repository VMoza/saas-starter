<script lang="ts">
  import { pricingPlans } from "./pricing_plans"
  import { page } from "$app/stores"

  interface Props {
    // Module context
    highlightedPlanId?: string
    callToAction: string
    currentPlanId?: string
    center?: boolean
  }

  let {
    highlightedPlanId = "",
    callToAction,
    currentPlanId = "",
    center = true,
  }: Props = $props()

  // Check if user is logged in
  const isLoggedIn = $page.data.session?.user !== undefined

  // Function to get the correct link based on login status
  function getSubscriptionLink(
    planId: string,
    stripePriceId: string | null,
  ): string {
    if (!isLoggedIn) {
      // If not logged in, redirect to login with a return URL to billing
      return `/login/sign_in?redirectTo=${encodeURIComponent("/account/billing")}`
    }

    // If logged in, go directly to subscription
    return `/account/subscribe/${stripePriceId ?? "free_plan"}`
  }
</script>

<div
  class="flex flex-col lg:flex-row gap-10 {center
    ? 'place-content-center'
    : ''} flex-wrap"
>
  {#each pricingPlans as plan}
    <div
      class="flex-none card card-bordered {plan.id === highlightedPlanId
        ? 'border-primary shadow-lg border-2'
        : 'border-gray-200'} shadow-xl flex-1 flex-grow min-w-[260px] max-w-[310px] p-6 transition-all hover:shadow-2xl hover:scale-105"
    >
      <div class="flex flex-col h-full">
        <div class="text-xl font-bold text-primary">{plan.name}</div>
        <p class="mt-2 text-sm text-gray-500 leading-relaxed min-h-[60px]">
          {plan.description}
        </p>
        <div class="mt-4 pt-4 text-sm text-gray-600 border-t border-gray-100">
          <div class="font-semibold mb-2">Plan Includes:</div>
          <ul class="list-disc list-inside mt-2 space-y-2">
            {#each plan.features as feature}
              <li class="text-sm">{feature}</li>
            {/each}
          </ul>
        </div>
        <div class="pt-8 mt-auto">
          <div class="flex items-baseline">
            <span class="text-4xl font-bold text-primary">{plan.price}</span>
            <span class="text-gray-400 ml-2">{plan.priceIntervalName}</span>
          </div>
          <div class="mt-6 pt-4 flex-1 flex flex-row items-center">
            {#if plan.id === currentPlanId}
              <div
                class="btn btn-outline btn-success no-animation w-full mx-auto cursor-default"
              >
                Current Plan
              </div>
            {:else}
              <a
                href={getSubscriptionLink(plan.id, plan?.stripe_price_id)}
                class="btn btn-primary w-full mx-auto {plan.id ===
                highlightedPlanId
                  ? 'btn-lg'
                  : ''}"
              >
                {callToAction}
              </a>
            {/if}
          </div>
        </div>
      </div>
    </div>
  {/each}
</div>
