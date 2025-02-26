<script lang="ts">
  import { page } from "$app/stores"
  import type { UsageResponse } from "$lib/usage-tracking"

  export let usageData: UsageResponse
  export let featureName: string
  export let upgradeUrl: string = "/account/billing"

  // Calculate percentage used
  $: percentUsed =
    usageData.limit === Infinity
      ? 0
      : Math.min(
          100,
          Math.round((usageData.currentUsage / usageData.limit) * 100),
        )

  // Determine progress bar color based on usage
  $: progressColor =
    percentUsed < 70
      ? "bg-success"
      : percentUsed < 90
        ? "bg-warning"
        : "bg-error"
</script>

<div class="card bg-base-100 shadow-sm border border-base-200 p-4">
  <div class="flex flex-col">
    <div class="flex justify-between items-center mb-2">
      <h3 class="font-semibold text-lg">{featureName} Usage</h3>

      {#if usageData.limit === Infinity}
        <span class="badge badge-success">Unlimited</span>
      {:else}
        <span class="text-sm">
          {usageData.currentUsage} / {usageData.limit} used
        </span>
      {/if}
    </div>

    {#if usageData.limit !== Infinity}
      <div class="w-full bg-base-200 rounded-full h-2.5 mb-2">
        <div
          class="h-2.5 rounded-full {progressColor}"
          style="width: {percentUsed}%"
        ></div>
      </div>

      <div class="flex justify-between text-xs text-base-content/70 mb-2">
        <span>0</span>
        <span>{usageData.limit}</span>
      </div>
    {/if}

    {#if usageData.remaining === 0}
      <div class="mt-2">
        <div class="alert alert-error shadow-sm text-sm">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="stroke-current flex-shrink-0 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              /></svg
            >
            <span
              >You've reached your {featureName.toLowerCase()} limit for this month.</span
            >
          </div>
        </div>
        <a href={upgradeUrl} class="btn btn-sm btn-primary w-full mt-3">
          Upgrade Plan
        </a>
      </div>
    {:else if percentUsed >= 80}
      <div class="mt-2">
        <div class="alert alert-warning shadow-sm text-sm">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="stroke-current flex-shrink-0 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              /></svg
            >
            <span
              >You're approaching your {featureName.toLowerCase()} limit for this
              month.</span
            >
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
