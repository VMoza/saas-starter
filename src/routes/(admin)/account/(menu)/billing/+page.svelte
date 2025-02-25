<script lang="ts">
  import { getContext } from "svelte"
  import type { Writable } from "svelte/store"
  import SettingsModule from "../settings/settings_module.svelte"
  import PricingModule from "../../../../(marketing)/pricing/pricing_module.svelte"
  import {
    pricingPlans,
    defaultPlanId,
  } from "../../../../(marketing)/pricing/pricing_plans"

  let adminSection: Writable<string> = getContext("adminSection")
  adminSection.set("billing")

  let { data } = $props()

  let currentPlanId = data.currentPlanId ?? defaultPlanId
  let currentPlanName =
    pricingPlans.find((x) => x.id === data.currentPlanId)?.name || "Free"
</script>

<svelte:head>
  <title>Subscription & Billing</title>
</svelte:head>

<h1 class="text-2xl font-bold mb-2">Subscription & Billing</h1>
<div>Manage your subscription and billing information.</div>

<div class="mt-8">
  <div class="bg-base-100 p-6 rounded-lg shadow-sm border border-base-200 mb-8">
    <h2 class="text-xl font-semibold mb-4">Current Plan</h2>
    <div class="flex items-center">
      <div class="badge badge-primary badge-lg mr-3">{currentPlanName}</div>
      <p class="text-base-content/70">
        {#if currentPlanId === "free"}
          You are currently on the Free plan.
        {:else if currentPlanId === "pro"}
          You are currently on the Pro plan.
        {:else if currentPlanId === "enterprise"}
          You are currently on the Enterprise plan.
        {:else}
          You are currently on the Free plan.
        {/if}
      </p>
    </div>

    {#if data.hasEverHadSubscription}
      <div class="mt-4">
        <a href="/account/billing/manage" class="btn btn-outline btn-sm"
          >Manage Subscription</a
        >
      </div>
    {/if}
  </div>

  <h2 class="text-xl font-semibold mb-4">Available Plans</h2>
  <PricingModule {currentPlanId} callToAction="Select Plan" center={false} />
</div>
