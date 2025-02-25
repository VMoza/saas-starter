<script lang="ts">
  import PricingModule from "./pricing_module.svelte"
  import { WebsiteName } from "./../../../config"

  type PlanFeatureRow = {
    name: string
    freeIncluded?: boolean
    proIncluded?: boolean
    enterpriseIncluded?: boolean
    freeString?: string
    proString?: string
    enterpriseString?: string
    header?: boolean
  }

  const planFeatures: PlanFeatureRow[] = [
    {
      name: "College Information",
      header: true,
    },
    {
      name: "College Database Access",
      freeIncluded: true,
      proIncluded: true,
      enterpriseIncluded: true,
    },
    {
      name: "Advanced Search Filters",
      freeIncluded: false,
      proIncluded: true,
      enterpriseIncluded: true,
    },
    {
      name: "College Saves",
      freeString: "5",
      proString: "Unlimited",
      enterpriseString: "Unlimited",
    },
    {
      name: "Application Support",
      header: true,
    },
    {
      name: "Personal Profile Creation",
      freeIncluded: true,
      proIncluded: true,
      enterpriseIncluded: true,
    },
    {
      name: "Deadline Reminders",
      freeIncluded: false,
      proIncluded: true,
      enterpriseIncluded: true,
    },
    {
      name: "Essay Topic Suggestions",
      freeIncluded: false,
      proIncluded: true,
      enterpriseIncluded: true,
    },
    {
      name: "Counselor AI Agent",
      freeString: "-",
      proString: "30/month",
      enterpriseString: "100/month",
    },
    {
      name: "Essay Review Assistance",
      freeIncluded: false,
      proIncluded: false,
      enterpriseIncluded: true,
    },
    {
      name: "Premium Features",
      header: true,
    },
    {
      name: "Priority Support",
      freeIncluded: false,
      proIncluded: false,
      enterpriseIncluded: true,
    },
    {
      name: "Personalized College Recommendations",
      freeIncluded: false,
      proIncluded: false,
      enterpriseIncluded: true,
    },
    {
      name: "Application Strategy Consultation",
      freeIncluded: false,
      proIncluded: false,
      enterpriseIncluded: true,
    },
  ]
</script>

<svelte:head>
  <title>Pricing</title>
  <meta name="description" content="Pricing - {WebsiteName}" />
</svelte:head>

<div class="min-h-[70vh] pb-8 pt-[5vh] px-4">
  <h1 class="text-3xl font-bold text-center">Pricing</h1>
  <h2 class="text-xl text-center text-slate-500 mt-1 pb-3">
    Totally free, scale to millions of users
  </h2>

  <div class="w-full my-8">
    <PricingModule callToAction="Get Started" highlightedPlanId="pro" />
    <h1 class="text-2xl font-bold text-center mt-24">Pricing FAQ</h1>
    <div class="flex place-content-center">
      <div class="join join-vertical max-w-xl py-6 mx-auto">
        <div class="collapse collapse-arrow join-item border border-primary">
          <input type="radio" name="faq-accordion" />
          <div class="collapse-title text-lg font-medium">
            What's included in the Free plan?
          </div>
          <div class="collapse-content">
            <p>
              Our Free plan gives you access to basic college information,
              limited search functionality, personal profile creation, and up to
              5 college saves. It's perfect for getting started with Ivy Honor.
            </p>
          </div>
        </div>
        <div class="collapse collapse-arrow join-item border border-primary">
          <input type="radio" name="faq-accordion" />
          <div class="collapse-title text-lg font-medium">
            What is the Counselor AI Agent?
          </div>
          <div class="collapse-content">
            <p>
              The Counselor AI Agent is our advanced AI tool that helps you
              write and edit your college application essays. Plus subscribers
              get 30 essay writes/edits per month, while Pro subscribers get 100
              per month.
            </p>
          </div>
        </div>
        <div class="collapse collapse-arrow join-item border border-primary">
          <input type="radio" name="faq-accordion" />
          <div class="collapse-title text-lg font-medium">
            Can I upgrade or downgrade my plan at any time?
          </div>
          <div class="collapse-content">
            <p>
              Yes, you can upgrade or downgrade your plan at any time. Changes
              will take effect immediately, and your billing will be prorated
              accordingly.
            </p>
          </div>
        </div>
        <div class="collapse collapse-arrow join-item border border-primary">
          <input type="radio" name="faq-accordion" />
          <div class="collapse-title text-lg font-medium">
            How do I cancel my subscription?
          </div>
          <div class="collapse-content">
            <p>
              You can cancel your subscription at any time from your account
              settings. Navigate to the Billing section and click on "Manage
              Subscription" to cancel.
            </p>
            <p class="mt-4">
              After cancellation, you'll continue to have access to your paid
              features until the end of your current billing period.
            </p>
          </div>
        </div>
      </div>
    </div>

    <svg style="display:none" version="2.0">
      <defs>
        <symbol
          id="checkcircle"
          viewBox="0 0 24 24"
          stroke-width="2"
          fill="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-4.105-4.498a.791.791 0 0 0-1.082.29l-3.828 6.63-1.733-2.08a.791.791 0 1 0-1.216 1.014l2.459 2.952a.792.792 0 0 0 .608.285.83.83 0 0 0 .068-.003.791.791 0 0 0 .618-.393L12.6 6.866a.791.791 0 0 0-.29-1.081z"
          />
        </symbol>
      </defs>
    </svg>

    <svg style="display:none" version="2.0">
      <defs>
        <symbol id="nocircle" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4,11H8a1,1,0,0,1,0-2h8a1,1,0,0,1,0,2Z"
          />
        </symbol>
      </defs>
    </svg>

    <h1 class="text-2xl font-bold text-center mt-16">Plan Features</h1>
    <h2 class="text-xl text-center text-slate-500 mt-1 pb-3">
      Compare all features across plans
    </h2>

    <div class="overflow-visible mx-auto max-w-4xl mt-4">
      <table class="table">
        <thead
          class="text-lg sticky top-0 bg-base-100 bg-opacity-50 z-10 backdrop-blur"
        >
          <tr>
            <th></th>
            <th class="text-center">Free</th>
            <th class="text-center">Plus</th>
            <th class="text-center">Pro</th>
          </tr>
        </thead>
        <tbody>
          {#each planFeatures as feature}
            {#if feature.header}
              <tr class="bg-base-200 font-bold">
                <td colspan="4">{feature.name} </td>
              </tr>
            {:else}
              <tr class="relative">
                <td>{feature.name} </td>
                <td class="text-center">
                  {#if feature.freeString}
                    {feature.freeString}
                  {:else if feature.freeIncluded}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-8 h-8 ml-2 inline text-success"
                    >
                      <use href="#checkcircle" />
                    </svg>
                  {:else}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-[26px] h-[26px] inline text-base-200"
                    >
                      <use href="#nocircle" />
                    </svg>
                  {/if}
                </td>
                <td class="text-center">
                  {#if feature.proString}
                    {feature.proString}
                  {:else if feature.proIncluded}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-8 h-8 ml-2 inline text-success"
                    >
                      <use href="#checkcircle" />
                    </svg>
                  {:else}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-[26px] h-[26px] inline text-base-200"
                    >
                      <use href="#nocircle" />
                    </svg>
                  {/if}
                </td>
                <td class="text-center">
                  {#if feature.enterpriseString}
                    {feature.enterpriseString}
                  {:else if feature.enterpriseIncluded}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-8 h-8 ml-2 inline text-success"
                    >
                      <use href="#checkcircle" />
                    </svg>
                  {:else}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-[26px] h-[26px] inline text-base-200"
                    >
                      <use href="#nocircle" />
                    </svg>
                  {/if}
                </td>
              </tr>
            {/if}
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
