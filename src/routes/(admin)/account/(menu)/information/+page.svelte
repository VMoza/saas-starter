<script lang="ts">
  import { onMount } from "svelte"
  import { setContext } from "svelte"

  // Set the admin section context
  const adminSectionStore = setContext("adminSection", {
    subscribe: () => {
      return () => {}
    },
    set: (value: string) => {},
    update: () => {},
  })

  adminSectionStore.set("information")

  // Define types for our data structure
  type GradeLevel =
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"

  // Test Score interface
  interface TestScore {
    id: string
    name: string
    score: string
    date: string
  }

  // Activity interface
  interface Activity {
    id: string
    name: string
    title: string
    startGrade: GradeLevel
    endGrade: GradeLevel
    hoursPerWeek: number
    weeksPerYear: number
    description: string
  }

  // Initialize data
  let testScores: TestScore[] = []
  let activities: Activity[] = []

  // For test score form
  let showAddTestForm = false
  let newTestScore: TestScore = createEmptyTestScore()
  let editingTestScoreId: string | null = null

  // For activity form
  let showAddActivityForm = false
  let newActivity: Activity = createEmptyActivity()
  let editingActivityId: string | null = null

  // Grade level options for select
  const gradeLevelOptions = [
    { value: "1", label: "1st Grade" },
    { value: "2", label: "2nd Grade" },
    { value: "3", label: "3rd Grade" },
    { value: "4", label: "4th Grade" },
    { value: "5", label: "5th Grade" },
    { value: "6", label: "6th Grade" },
    { value: "7", label: "7th Grade" },
    { value: "8", label: "8th Grade" },
    { value: "9", label: "9th Grade" },
    { value: "10", label: "10th Grade" },
    { value: "11", label: "11th Grade" },
    { value: "12", label: "12th Grade" },
  ]

  // Common test names
  const commonTestNames = [
    "SAT",
    "ACT",
    "PSAT",
    "AP Biology",
    "AP Chemistry",
    "AP Physics",
    "AP Calculus AB",
    "AP Calculus BC",
    "AP English Language",
    "AP English Literature",
    "AP U.S. History",
    "AP World History",
    "AP Computer Science",
    "SAT Subject Test - Math",
    "SAT Subject Test - Biology",
    "SAT Subject Test - Chemistry",
    "SAT Subject Test - Physics",
    "SAT Subject Test - Literature",
    "SAT Subject Test - U.S. History",
    "SAT Subject Test - World History",
    "IB Biology",
    "IB Chemistry",
    "IB Physics",
    "IB Mathematics",
    "IB English",
    "IB History",
  ]

  // Helper function to create a new empty test score
  function createEmptyTestScore(): TestScore {
    return {
      id: crypto.randomUUID(),
      name: "",
      score: "",
      date: new Date().toISOString().split("T")[0],
    }
  }

  // Helper function to create a new empty activity
  function createEmptyActivity(): Activity {
    return {
      id: crypto.randomUUID(),
      name: "",
      title: "",
      startGrade: "9",
      endGrade: "12",
      hoursPerWeek: 0,
      weeksPerYear: 0,
      description: "",
    }
  }

  // Add a new test score
  function addTestScore() {
    if (!newTestScore.name || !newTestScore.score) return

    if (editingTestScoreId) {
      // Update existing test score
      const index = testScores.findIndex((t) => t.id === editingTestScoreId)
      if (index !== -1) {
        testScores[index] = { ...newTestScore }
        testScores = [...testScores]
      }
    } else {
      // Add new test score
      testScores = [...testScores, { ...newTestScore }]
    }

    // Reset form
    resetTestScoreForm()
  }

  // Delete a test score
  function deleteTestScore(id: string) {
    testScores = testScores.filter((test) => test.id !== id)
  }

  // Edit a test score
  function editTestScore(test: TestScore) {
    newTestScore = { ...test }
    editingTestScoreId = test.id
    showAddTestForm = true
  }

  // Reset the test score form
  function resetTestScoreForm() {
    newTestScore = createEmptyTestScore()
    editingTestScoreId = null
    showAddTestForm = false
  }

  // Add a new activity
  function addActivity() {
    if (!newActivity.name) return

    if (editingActivityId) {
      // Update existing activity
      const index = activities.findIndex((a) => a.id === editingActivityId)
      if (index !== -1) {
        activities[index] = { ...newActivity }
        activities = [...activities]
      }
    } else {
      // Add new activity
      activities = [...activities, { ...newActivity }]
    }

    // Reset form
    resetActivityForm()
  }

  // Delete an activity
  function deleteActivity(id: string) {
    activities = activities.filter((activity) => activity.id !== id)
  }

  // Edit an activity
  function editActivity(activity: Activity) {
    newActivity = { ...activity }
    editingActivityId = activity.id
    showAddActivityForm = true
  }

  // Reset the activity form
  function resetActivityForm() {
    newActivity = createEmptyActivity()
    editingActivityId = null
    showAddActivityForm = false
  }

  // Format grade level for display
  function formatGradeLevel(grade: GradeLevel): string {
    const num = parseInt(grade)
    const suffix = num === 1 ? "st" : num === 2 ? "nd" : num === 3 ? "rd" : "th"
    return `${num}${suffix} grade`
  }

  // Format grade range for display
  function formatGradeRange(start: GradeLevel, end: GradeLevel): string {
    if (start === end) {
      return formatGradeLevel(start)
    }
    return `${formatGradeLevel(start)} - ${formatGradeLevel(end)}`
  }

  // Load data from localStorage on mount
  onMount(() => {
    const savedTestScores = localStorage.getItem("userTestScores")
    if (savedTestScores) {
      try {
        testScores = JSON.parse(savedTestScores)
      } catch (e) {
        console.error("Failed to parse saved test scores", e)
      }
    }

    const savedActivities = localStorage.getItem("userActivities")
    if (savedActivities) {
      try {
        activities = JSON.parse(savedActivities)
      } catch (e) {
        console.error("Failed to parse saved activities", e)
      }
    }

    // Save data to localStorage when they change
    return () => {
      localStorage.setItem("userTestScores", JSON.stringify(testScores))
      localStorage.setItem("userActivities", JSON.stringify(activities))
    }
  })

  // Watch for changes to data and save to localStorage
  $: {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("userTestScores", JSON.stringify(testScores))
      localStorage.setItem("userActivities", JSON.stringify(activities))
    }
  }
</script>

<div class="container mx-auto">
  <h1 class="text-3xl font-bold mb-6">Personal Information</h1>

  <!-- Test Scores Section -->
  <div class="mb-12">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold">Test Scores</h2>
      {#if !showAddTestForm}
        <button
          class="btn btn-primary"
          on:click={() => (showAddTestForm = true)}
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Test Score
        </button>
      {/if}
    </div>

    {#if showAddTestForm}
      <div class="card bg-base-200 shadow-sm mb-6">
        <div class="card-body">
          <h3 class="card-title text-xl mb-4">
            {editingTestScoreId ? "Edit Test Score" : "Add New Test Score"}
          </h3>

          <form on:submit|preventDefault={addTestScore} class="space-y-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Test Name</span>
              </label>
              <input
                type="text"
                class="input input-bordered w-full"
                placeholder="e.g., SAT, ACT, AP Biology"
                bind:value={newTestScore.name}
                list="common-tests"
                required
              />
              <datalist id="common-tests">
                {#each commonTestNames as testName}
                  <option value={testName} />
                {/each}
              </datalist>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">Score</span>
              </label>
              <input
                type="text"
                class="input input-bordered w-full"
                placeholder="e.g., 1500, 34, 5"
                bind:value={newTestScore.score}
                required
              />
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">Test Date</span>
              </label>
              <input
                type="date"
                class="input input-bordered w-full"
                bind:value={newTestScore.date}
              />
            </div>

            <div class="flex justify-end gap-2">
              <button
                type="button"
                class="btn btn-ghost"
                on:click={resetTestScoreForm}
              >
                Cancel
              </button>
              <button type="submit" class="btn btn-primary">
                {editingTestScoreId ? "Update" : "Add"} Test Score
              </button>
            </div>
          </form>
        </div>
      </div>
    {/if}

    {#if testScores.length === 0}
      <div class="card bg-base-200 shadow-sm">
        <div class="card-body text-center">
          <p class="text-lg mb-4">You haven't added any test scores yet.</p>
          <button
            class="btn btn-primary mx-auto"
            on:click={() => (showAddTestForm = true)}
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Your First Test Score
          </button>
        </div>
      </div>
    {:else}
      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>Test Name</th>
              <th>Score</th>
              <th>Date</th>
              <th class="w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each testScores as test (test.id)}
              <tr>
                <td class="font-medium">{test.name}</td>
                <td>{test.score}</td>
                <td>{new Date(test.date).toLocaleDateString()}</td>
                <td>
                  <div class="flex gap-2">
                    <button
                      class="btn btn-sm btn-ghost btn-square"
                      on:click={() => editTestScore(test)}
                      title="Edit"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      class="btn btn-sm btn-ghost btn-square text-error"
                      on:click={() => deleteTestScore(test.id)}
                      title="Delete"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>

  <!-- Activities Section -->
  <div class="mb-8">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold">Activities</h2>
      {#if !showAddActivityForm}
        <button
          class="btn btn-primary"
          on:click={() => (showAddActivityForm = true)}
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Activity
        </button>
      {/if}
    </div>

    {#if showAddActivityForm}
      <div class="card bg-base-200 shadow-sm mb-6">
        <div class="card-body">
          <h3 class="card-title text-xl mb-4">
            {editingActivityId ? "Edit Activity" : "Add New Activity"}
          </h3>

          <form on:submit|preventDefault={addActivity} class="space-y-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Activity Name</span>
              </label>
              <input
                type="text"
                class="input input-bordered w-full"
                placeholder="e.g., Debate Club, Basketball, Volunteer Work"
                bind:value={newActivity.name}
                required
              />
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">Title/Position</span>
              </label>
              <input
                type="text"
                class="input input-bordered w-full"
                placeholder="e.g., President, Captain, Member"
                bind:value={newActivity.title}
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Start Grade</span>
                </label>
                <select
                  class="select select-bordered w-full"
                  bind:value={newActivity.startGrade}
                >
                  {#each gradeLevelOptions as option}
                    <option value={option.value}>{option.label}</option>
                  {/each}
                </select>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">End Grade</span>
                </label>
                <select
                  class="select select-bordered w-full"
                  bind:value={newActivity.endGrade}
                >
                  {#each gradeLevelOptions as option}
                    <option value={option.value}>{option.label}</option>
                  {/each}
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Hours per Week</span>
                </label>
                <input
                  type="number"
                  class="input input-bordered w-full"
                  bind:value={newActivity.hoursPerWeek}
                  min="0"
                  step="0.5"
                />
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">Weeks per Year</span>
                </label>
                <input
                  type="number"
                  class="input input-bordered w-full"
                  bind:value={newActivity.weeksPerYear}
                  min="0"
                  max="52"
                  step="1"
                />
              </div>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">Description</span>
              </label>
              <textarea
                class="textarea textarea-bordered h-24"
                placeholder="Briefly describe your involvement, achievements, or responsibilities"
                bind:value={newActivity.description}
              ></textarea>
            </div>

            <div class="flex justify-end gap-2">
              <button
                type="button"
                class="btn btn-ghost"
                on:click={resetActivityForm}
              >
                Cancel
              </button>
              <button type="submit" class="btn btn-primary">
                {editingActivityId ? "Update" : "Add"} Activity
              </button>
            </div>
          </form>
        </div>
      </div>
    {/if}

    {#if activities.length === 0}
      <div class="card bg-base-200 shadow-sm">
        <div class="card-body text-center">
          <p class="text-lg mb-4">You haven't added any activities yet.</p>
          <button
            class="btn btn-primary mx-auto"
            on:click={() => (showAddActivityForm = true)}
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Your First Activity
          </button>
        </div>
      </div>
    {:else}
      <div class="space-y-4">
        {#each activities as activity (activity.id)}
          <div class="card bg-base-200 shadow-sm">
            <div class="card-body">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="card-title text-xl">{activity.name}</h3>
                  {#if activity.title}
                    <p class="font-medium">{activity.title}</p>
                  {/if}
                </div>
                <div class="flex gap-2">
                  <button
                    class="btn btn-sm btn-ghost btn-square"
                    on:click={() => editActivity(activity)}
                    title="Edit"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    class="btn btn-sm btn-ghost btn-square text-error"
                    on:click={() => deleteActivity(activity.id)}
                    title="Delete"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                <div>
                  <span class="font-semibold">Grade Levels:</span>
                  <span
                    >{formatGradeRange(
                      activity.startGrade,
                      activity.endGrade,
                    )}</span
                  >
                </div>
                <div>
                  <span class="font-semibold">Time Commitment:</span>
                  <span
                    >{activity.hoursPerWeek} hours/week, {activity.weeksPerYear}
                    weeks/year</span
                  >
                </div>
                <div>
                  <span class="font-semibold">Total Hours/Year:</span>
                  <span
                    >{(activity.hoursPerWeek * activity.weeksPerYear).toFixed(
                      1,
                    )} hours</span
                  >
                </div>
              </div>

              {#if activity.description}
                <div class="mt-2">
                  <span class="font-semibold">Description:</span>
                  <p class="mt-1">{activity.description}</p>
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
