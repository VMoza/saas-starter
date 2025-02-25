<script lang="ts">
  import { getContext, onMount } from "svelte"
  import type { Writable } from "svelte/store"

  let adminSection: Writable<string> = getContext("adminSection")
  adminSection.set("home")

  // For the greeting based on time of day
  let greeting = "Hello"

  // For the chart data
  let chartLoaded = false

  onMount(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours()
    if (hour < 12) greeting = "Good morning"
    else if (hour < 18) greeting = "Good afternoon"
    else greeting = "Good evening"

    // Simulate chart loading
    setTimeout(() => {
      chartLoaded = true
    }, 500)
  })

  // Mock data for quick actions
  const quickActions = [
    {
      icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
      title: "Add College",
      link: "/account/colleges",
    },
    {
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      title: "View Reports",
      link: "#",
    },
    {
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
      title: "Schedule Call",
      link: "#",
    },
    {
      icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z",
      title: "Billing",
      link: "/account/billing",
    },
  ]

  // Mock data for recent activities - more relevant to college admissions
  const recentActivities = [
    {
      action: "Added Stanford University to your list",
      time: "2 hours ago",
      icon: "university",
    },
    {
      action: "Updated your personal statement draft",
      time: "Yesterday",
      icon: "document",
    },
    {
      action: "Scheduled a consultation call",
      time: "3 days ago",
      icon: "phone",
    },
    {
      action: 'Completed the "Essay Writing" module',
      time: "1 week ago",
      icon: "book",
    },
  ]

  // College application deadlines
  const upcomingDeadlines = [
    {
      college: "Harvard University",
      deadline: "January 1, 2024",
      daysLeft: 42,
    },
    {
      college: "Stanford University",
      deadline: "December 1, 2023",
      daysLeft: 12,
    },
    { college: "MIT", deadline: "January 5, 2024", daysLeft: 46 },
    { college: "Yale University", deadline: "January 2, 2024", daysLeft: 43 },
  ]
</script>

<svelte:head>
  <title>Dashboard | Ivy Honor</title>
</svelte:head>

<div class="flex flex-col space-y-8">
  <!-- Header Section with Greeting -->
  <div class="bg-[#1e3a6e] rounded-lg p-6 text-white shadow-md">
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center"
    >
      <div>
        <h2 class="text-2xl font-bold">{greeting}!</h2>
        <p class="mt-1 text-blue-100">
          Welcome to your college admissions dashboard
        </p>
      </div>
      <div class="mt-4 md:mt-0">
        <a
          href="#schedule"
          class="bg-white text-[#1e3a6e] px-4 py-2 rounded-md font-medium shadow-sm hover:bg-blue-50 transition-colors flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Schedule Consultation
        </a>
      </div>
    </div>
  </div>

  <!-- Quick Actions Section -->
  <div>
    <h3 class="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h3>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      {#each quickActions as action}
        <a
          href={action.link}
          class="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center"
        >
          <div class="bg-blue-50 p-3 rounded-full mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-[#1e3a6e]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d={action.icon}
              />
            </svg>
          </div>
          <span class="text-sm font-medium text-gray-700">{action.title}</span>
        </a>
      {/each}
    </div>
  </div>

  <!-- Main Content Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Left Column: Application Status -->
    <div class="space-y-6">
      <h3 class="text-lg font-semibold text-gray-700">Application Status</h3>

      <!-- Application Progress Card -->
      <div class="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-sm text-gray-500">Overall Progress</p>
            <h4 class="text-2xl font-bold text-gray-800 mt-1">65%</h4>
          </div>
          <div class="bg-blue-50 p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-[#1e3a6e]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div class="bg-[#1e3a6e] h-2.5 rounded-full" style="width: 65%"></div>
        </div>
        <div class="mt-2 flex justify-between text-xs text-gray-500">
          <span>Essays: 2/3</span>
          <span>Recommendations: 3/3</span>
          <span>Forms: 4/5</span>
        </div>
      </div>

      <!-- Upcoming Deadlines -->
      <div>
        <h3 class="text-lg font-semibold text-gray-700 mb-4">
          Upcoming Deadlines
        </h3>
        <div
          class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
        >
          <ul class="divide-y divide-gray-100">
            {#each upcomingDeadlines as deadline}
              <li class="p-4 hover:bg-gray-50 transition-colors">
                <div class="flex justify-between items-center">
                  <div>
                    <p class="font-medium text-gray-800">{deadline.college}</p>
                    <p class="text-sm text-gray-500 mt-1">
                      {deadline.deadline}
                    </p>
                  </div>
                  <div
                    class={deadline.daysLeft <= 14
                      ? "text-red-600 font-medium"
                      : "text-gray-600"}
                  >
                    {deadline.daysLeft} days left
                  </div>
                </div>
              </li>
            {/each}
          </ul>
          <div class="bg-gray-50 px-4 py-3 text-center">
            <button
              class="text-sm text-[#1e3a6e] font-medium hover:text-blue-800"
              >View All Deadlines</button
            >
          </div>
        </div>
      </div>

      <!-- Demo Content Notice (styled better) -->
      <div class="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-amber-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-amber-800">Demo Content</h3>
            <div class="mt-2 text-sm text-amber-700">
              <p>
                This page is just a placeholder. Replace this page with your
                app's content and functionality.
              </p>
              <p class="mt-1">
                The <a href="/account/billing" class="font-medium underline"
                  >billing</a
                >
                and
                <a href="/account/settings" class="font-medium underline"
                  >settings</a
                > pages are functional demos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Column: Activity and Tasks -->
    <div class="space-y-6">
      <!-- College Application Timeline -->
      <div>
        <h3 class="text-lg font-semibold text-gray-700 mb-4">
          Application Timeline
        </h3>
        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div class="relative">
            <!-- Timeline line -->
            <div class="absolute h-full w-0.5 bg-gray-200 left-4 top-0"></div>

            <!-- Timeline items -->
            <div class="ml-12 space-y-6 relative pb-2">
              <!-- Current step -->
              <div class="relative">
                <div
                  class="absolute -left-12 mt-1.5 h-8 w-8 rounded-full border-2 border-[#1e3a6e] bg-white flex items-center justify-center"
                >
                  <div class="h-4 w-4 rounded-full bg-[#1e3a6e]"></div>
                </div>
                <div>
                  <h4 class="text-base font-medium text-[#1e3a6e]">
                    Essay Writing
                  </h4>
                  <p class="text-sm text-gray-600 mt-1">
                    Complete your personal statement and supplemental essays
                  </p>
                  <p class="text-xs text-gray-500 mt-1">Current Step</p>
                </div>
              </div>

              <!-- Upcoming steps -->
              <div class="relative">
                <div
                  class="absolute -left-12 mt-1.5 h-8 w-8 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center"
                ></div>
                <div>
                  <h4 class="text-base font-medium text-gray-600">
                    Application Review
                  </h4>
                  <p class="text-sm text-gray-600 mt-1">
                    Final review of all application materials
                  </p>
                  <p class="text-xs text-gray-500 mt-1">Next Step</p>
                </div>
              </div>

              <div class="relative">
                <div
                  class="absolute -left-12 mt-1.5 h-8 w-8 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center"
                ></div>
                <div>
                  <h4 class="text-base font-medium text-gray-600">
                    Submission
                  </h4>
                  <p class="text-sm text-gray-600 mt-1">
                    Submit applications to selected universities
                  </p>
                  <p class="text-xs text-gray-500 mt-1">Final Step</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div>
        <h3 class="text-lg font-semibold text-gray-700 mb-4">
          Recent Activity
        </h3>
        <div
          class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
        >
          <ul class="divide-y divide-gray-100">
            {#each recentActivities as activity}
              <li class="p-4 hover:bg-gray-50 transition-colors">
                <div class="flex items-start">
                  <div class="flex-shrink-0 mr-3">
                    {#if activity.icon === "university"}
                      <div class="bg-blue-100 p-2 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 text-[#1e3a6e]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                    {:else if activity.icon === "document"}
                      <div class="bg-purple-100 p-2 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 text-purple-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                    {:else if activity.icon === "phone"}
                      <div class="bg-green-100 p-2 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                    {:else if activity.icon === "book"}
                      <div class="bg-amber-100 p-2 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 text-amber-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      </div>
                    {/if}
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-800">
                      {activity.action}
                    </p>
                    <p class="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              </li>
            {/each}
          </ul>
          <div class="bg-gray-50 px-4 py-3 text-center">
            <button
              class="text-sm text-[#1e3a6e] font-medium hover:text-blue-800"
              >View All Activity</button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
