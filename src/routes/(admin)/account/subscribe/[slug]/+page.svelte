<script lang="ts">
  import { onMount } from "svelte"
  import { page } from "$app/stores"
  import { goto } from "$app/navigation"
  import { pricingPlans } from "../../../../(marketing)/pricing/pricing_plans"

  // Get the plan from the URL slug
  const slug = $page.params.slug

  // Find the plan details
  const plan = pricingPlans.find((p) => p.stripe_price_id === slug)

  onMount(() => {
    // If we're on the free plan page, redirect to account
    if (slug === "free_plan") {
      goto("/account")
    }
  })
</script>

<svelte:head>
  <title>Processing Subscription</title>
</svelte:head>

<div class="min-h-[70vh] flex flex-col items-center justify-center p-4">
  <div class="card w-full max-w-md bg-base-100 shadow-xl">
    <div class="card-body items-center text-center">
      <h2 class="card-title text-2xl mb-4">Processing Your Subscription</h2>

      {#if plan}
        <p class="mb-6">
          You're subscribing to the <span class="font-bold text-primary"
            >{plan.name}</span
          > plan.
        </p>
      {:else}
        <p class="mb-6">Processing your subscription...</p>
      {/if}

      <div class="flex flex-col items-center gap-4">
        <div class="loading loading-spinner loading-lg text-primary"></div>
        <p class="text-sm text-gray-500">
          You'll be redirected to Stripe's secure checkout page in a moment.
        </p>
      </div>
    </div>
  </div>
</div>
