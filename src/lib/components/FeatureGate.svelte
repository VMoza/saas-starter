<script lang="ts">
  import { page } from "$app/stores"
  import type { SubscriptionPlan } from "$lib/subscription"
  import { hasFeatureAccess } from "$lib/subscription"

  export let requiredPlan: SubscriptionPlan = "pro"
  export let featureName: string
  export let description: string = ""
  export let upgradeUrl: string = "/account/billing"

  // Get the user's subscription info from the page data
  $: subscriptionInfo = $page.data.subscriptionInfo

  // Check if the user has access to this feature
  $: hasAccess =
    subscriptionInfo && hasFeatureAccess(subscriptionInfo.planId, requiredPlan)

  // Get the plan name for display
  $: planName = requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)
</script>

<div>
  {#if hasAccess}
    <slot />
  {:else}
    <div
      class="card bg-base-100 shadow-lg border border-base-300 p-6 text-center"
    >
      <div class="flex flex-col items-center gap-4">
        <div class="bg-base-200 p-4 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-10 w-10 text-base-content/70"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        <h3 class="text-xl font-bold">{featureName} is a {planName} Feature</h3>

        {#if description}
          <p class="text-base-content/70">{description}</p>
        {:else}
          <p class="text-base-content/70">
            Upgrade to the {planName} plan or higher to access this feature.
          </p>
        {/if}

        <a href={upgradeUrl} class="btn btn-primary mt-2">
          Upgrade to {planName}
        </a>
      </div>
    </div>
  {/if}
</div>
