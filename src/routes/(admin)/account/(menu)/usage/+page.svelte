<script lang="ts">
  import { page } from "$app/stores"
  import { onMount } from "svelte"
  import SubscriptionUsage from "$lib/components/SubscriptionUsage.svelte"
  import type { UsageResponse } from "$lib/usage-tracking"
  import { pricingPlans } from "../../../../(marketing)/pricing/pricing_plans"

  // Get the subscription info from the page data
  $: subscriptionInfo = $page.data.subscriptionInfo

  // Initialize usage data
  let essayUsage: UsageResponse = {
    allowed: true,
    currentUsage: 0,
    limit: 0,
    remaining: 0,
  }

  let collegeSavesUsage: UsageResponse = {
    allowed: true,
    currentUsage: 0,
    limit: 0,
    remaining: 0,
  }

  let loading = true
  let error = false

  // Find the current plan details
  $: currentPlan =
    pricingPlans.find((p) => p.id === subscriptionInfo?.planId) ||
    pricingPlans[0]

  onMount(async () => {
    try {
      // Fetch usage data from the server
      const essayResponse = await fetch("/api/usage/essayWrites")
      const collegeSavesResponse = await fetch("/api/usage/collegeSaves")

      if (!essayResponse.ok || !collegeSavesResponse.ok) {
        throw new Error("Failed to fetch usage data")
      }

      essayUsage = await essayResponse.json()
      collegeSavesUsage = await collegeSavesResponse.json()
    } catch (err) {
      console.error("Error fetching usage data:", err)
      error = true
    } finally {
      loading = false
    }
  })
</script>

<svelte:head>
  <title>Usage Dashboard</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="flex flex-col gap-8">
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-2xl">Usage Dashboard</h2>
        <p class="text-base-content/70">
          Monitor your feature usage and subscription limits.
        </p>

        {#if loading}
          <div class="flex justify-center items-center py-12">
            <div class="loading loading-spinner loading-lg text-primary"></div>
          </div>
        {:else if error}
          <div class="alert alert-error shadow-lg mt-4">
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
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                /></svg
              >
              <span>Error loading usage data. Please try again later.</span>
            </div>
          </div>
        {:else}
          <div class="mt-4">
            <div class="alert shadow-lg mb-6">
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
                  <h3 class="font-bold">Current Plan: {currentPlan.name}</h3>
                  <div class="text-xs">
                    Usage limits reset at the beginning of each month.
                  </div>
                </div>
              </div>
              <div class="flex-none">
                <a href="/account/billing" class="btn btn-sm">Change Plan</a>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SubscriptionUsage
                usageData={essayUsage}
                featureName="Essay Writes"
              />

              <SubscriptionUsage
                usageData={collegeSavesUsage}
                featureName="College Saves"
              />
            </div>
          </div>
        {/if}
      </div>
    </div>

    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-2xl">Plan Comparison</h2>

        <div class="overflow-x-auto mt-4">
          <table class="table w-full">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Free</th>
                <th>Plus</th>
                <th>Pro</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Essay Writes</td>
                <td>0</td>
                <td>30 / month</td>
                <td>100 / month</td>
              </tr>
              <tr>
                <td>College Saves</td>
                <td>5</td>
                <td>Unlimited</td>
                <td>Unlimited</td>
              </tr>
              <tr>
                <td>Advanced Search</td>
                <td>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-error"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </td>
                <td>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-success"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </td>
                <td>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-success"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </td>
              </tr>
              <tr>
                <td>Priority Support</td>
                <td>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-error"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </td>
                <td>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-error"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </td>
                <td>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-success"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-6">
          <a href="/account/billing" class="btn btn-primary">
            {#if subscriptionInfo?.planId === "free"}
              Upgrade Your Plan
            {:else if subscriptionInfo?.planId === "pro"}
              Manage Your Subscription
            {:else}
              Change Your Plan
            {/if}
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
