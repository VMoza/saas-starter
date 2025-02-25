<script lang="ts">
  import { getContext } from "svelte"
  import type { Writable } from "svelte/store"
  import { onMount } from "svelte"

  // Define College type
  interface College {
    id: number
    name: string
    priority: string
    deadline: string
    major: string
    applicationCost: string
    attendanceCost: string
    applicationType: string
    status: string
    user_id?: string
  }

  let adminSection: Writable<string> = getContext("adminSection")
  adminSection.set("colleges")

  // College data will be loaded from the API
  let colleges: College[] = []
  let isLoading = true
  let error: string | null = null

  // Status badge colors
  function getStatusColor(status: string) {
    switch (status) {
      case "Accepted":
        return "badge-success"
      case "Rejected":
        return "badge-error"
      case "Waitlisted":
        return "badge-warning"
      case "Submitted":
        return "badge-info"
      case "Pending":
        return "badge-ghost"
      default:
        return "badge-ghost"
    }
  }

  // Priority badge colors
  function getPriorityColor(priority: string) {
    switch (priority) {
      case "High":
        return "badge-primary"
      case "Medium":
        return "badge-secondary"
      case "Low":
        return "badge-accent"
      default:
        return "badge-ghost"
    }
  }

  // Fetch colleges from the API
  async function fetchColleges() {
    isLoading = true
    error = null

    try {
      const response = await fetch("/api/colleges")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || `Error fetching colleges: ${response.statusText}`,
        )
      }

      // Ensure we cast the data to the correct type
      colleges = (data.colleges || []) as College[]

      // If no colleges are returned, use sample data for demonstration
      if (colleges.length === 0) {
        colleges = getSampleColleges()
      }
    } catch (err: unknown) {
      console.error("Failed to fetch colleges:", err)
      error = err instanceof Error ? err.message : String(err)
      // Use sample data if API fails
      colleges = getSampleColleges()
    } finally {
      isLoading = false
    }
  }

  // Sample college data for demonstration
  function getSampleColleges(): College[] {
    return [
      {
        id: 1,
        name: "Harvard University",
        priority: "High",
        deadline: "January 1, 2024",
        major: "Computer Science",
        applicationCost: "$75",
        attendanceCost: "$76,763/year",
        applicationType: "Regular Decision",
        status: "Pending",
      },
      {
        id: 2,
        name: "Stanford University",
        priority: "High",
        deadline: "January 5, 2024",
        major: "Computer Science",
        applicationCost: "$90",
        attendanceCost: "$82,162/year",
        applicationType: "Regular Decision",
        status: "Submitted",
      },
      {
        id: 3,
        name: "MIT",
        priority: "Medium",
        deadline: "January 1, 2024",
        major: "Computer Science",
        applicationCost: "$75",
        attendanceCost: "$79,850/year",
        applicationType: "Early Action",
        status: "Accepted",
      },
      {
        id: 4,
        name: "UC Berkeley",
        priority: "Medium",
        deadline: "November 30, 2023",
        major: "Computer Science",
        applicationCost: "$70",
        attendanceCost: "$43,980/year",
        applicationType: "Regular Decision",
        status: "Rejected",
      },
      {
        id: 5,
        name: "Yale University",
        priority: "Low",
        deadline: "January 2, 2024",
        major: "Computer Science",
        applicationCost: "$80",
        attendanceCost: "$80,700/year",
        applicationType: "Regular Decision",
        status: "Waitlisted",
      },
    ]
  }

  // Add new college form
  let showAddForm = false
  let newCollege: Omit<College, "id"> = {
    name: "",
    priority: "Medium",
    deadline: "",
    major: "",
    applicationCost: "",
    attendanceCost: "",
    applicationType: "Regular Decision",
    status: "Pending",
  }

  async function addCollege() {
    // Generate a temporary ID (will be replaced by the database)
    const tempId =
      colleges.length > 0 ? Math.max(...colleges.map((c) => c.id)) + 1 : 1

    const collegeToAdd: College = {
      id: tempId,
      ...newCollege,
    }

    // Optimistically update UI
    colleges = [...colleges, collegeToAdd]

    // Reset form
    newCollege = {
      name: "",
      priority: "Medium",
      deadline: "",
      major: "",
      applicationCost: "",
      attendanceCost: "",
      applicationType: "Regular Decision",
      status: "Pending",
    }

    showAddForm = false

    // Save to database
    await saveToDatabase()
  }

  // Edit college functionality
  let editingCollege: number | null = null
  let editFormData: College | null = null

  function startEdit(college: College) {
    editingCollege = college.id
    editFormData = { ...college }
    showAddForm = false
  }

  function cancelEdit() {
    editingCollege = null
    editFormData = null
  }

  async function saveEdit() {
    if (!editFormData) return

    // Optimistically update UI
    colleges = colleges.map((college) =>
      college.id === editingCollege ? { ...editFormData } : college,
    )

    editingCollege = null
    editFormData = null

    // Save to database
    await saveToDatabase()
  }

  // Delete college functionality
  async function deleteCollege(id: number) {
    if (confirm("Are you sure you want to delete this college application?")) {
      // Optimistically update UI
      colleges = colleges.filter((college) => college.id !== id)

      try {
        const response = await fetch(`/api/colleges?id=${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error(`Failed to delete college: ${response.statusText}`)
        }
      } catch (err: unknown) {
        console.error("Error deleting college:", err)
        // If deletion fails, refresh the list
        await fetchColleges()
      }
    }
  }

  // Save colleges to database
  async function saveToDatabase() {
    try {
      const response = await fetch("/api/colleges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(colleges),
      })

      if (!response.ok) {
        throw new Error(`Failed to save colleges: ${response.statusText}`)
      }

      const data = await response.json()

      // Update with data from server (to get proper IDs, etc.)
      if (data.colleges) {
        colleges = data.colleges as College[]
      }
    } catch (err: unknown) {
      console.error("Error saving colleges:", err)
      // We could show an error message to the user here
    }
  }

  // Load colleges when the component mounts
  onMount(() => {
    fetchColleges()
  })
</script>

<svelte:head>
  <title>College Applications</title>
</svelte:head>

<div class="flex justify-between items-center mb-6">
  <h1 class="text-2xl font-bold">College Applications Dashboard</h1>
  <button
    class="btn btn-primary"
    on:click={() => {
      showAddForm = !showAddForm
      if (showAddForm) {
        editingCollege = null
        editFormData = null
      }
    }}
  >
    {showAddForm ? "Cancel" : "Add College"}
  </button>
</div>

{#if error}
  <div class="alert alert-error mb-6">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="stroke-current shrink-0 h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <span>Error: {error}</span>
    {#if error.includes("does not exist") || error.includes("migration")}
      <div class="mt-2">
        <p>The colleges table needs to be created in your Supabase database.</p>
        <p>Please run the migration script or contact your administrator.</p>
      </div>
    {/if}
  </div>
{/if}

{#if showAddForm}
  <div class="bg-base-200 p-6 rounded-lg mb-8">
    <h2 class="text-xl font-bold mb-4">Add New College</h2>
    <form
      on:submit|preventDefault={addCollege}
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div class="form-control">
        <label class="label" for="college-name">College Name</label>
        <input
          id="college-name"
          type="text"
          bind:value={newCollege.name}
          class="input input-bordered"
          required
        />
      </div>

      <div class="form-control">
        <label class="label" for="priority">Priority</label>
        <select
          id="priority"
          bind:value={newCollege.priority}
          class="select select-bordered"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <div class="form-control">
        <label class="label" for="deadline">Application Deadline</label>
        <input
          id="deadline"
          type="text"
          bind:value={newCollege.deadline}
          class="input input-bordered"
          required
        />
      </div>

      <div class="form-control">
        <label class="label" for="major">Major</label>
        <input
          id="major"
          type="text"
          bind:value={newCollege.major}
          class="input input-bordered"
          required
        />
      </div>

      <div class="form-control">
        <label class="label" for="app-cost">Application Cost</label>
        <input
          id="app-cost"
          type="text"
          bind:value={newCollege.applicationCost}
          class="input input-bordered"
          required
        />
      </div>

      <div class="form-control">
        <label class="label" for="attend-cost">Cost to Attend</label>
        <input
          id="attend-cost"
          type="text"
          bind:value={newCollege.attendanceCost}
          class="input input-bordered"
          required
        />
      </div>

      <div class="form-control">
        <label class="label" for="app-type">Application Type</label>
        <select
          id="app-type"
          bind:value={newCollege.applicationType}
          class="select select-bordered"
        >
          <option value="Early Decision">Early Decision</option>
          <option value="Early Action">Early Action</option>
          <option value="Regular Decision">Regular Decision</option>
          <option value="Rolling">Rolling</option>
        </select>
      </div>

      <div class="form-control">
        <label class="label" for="status">Status</label>
        <select
          id="status"
          bind:value={newCollege.status}
          class="select select-bordered"
        >
          <option value="Pending">Pending</option>
          <option value="Submitted">Submitted</option>
          <option value="Waitlisted">Waitlisted</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div class="col-span-1 md:col-span-2 mt-4">
        <button type="submit" class="btn btn-primary">Add College</button>
      </div>
    </form>
  </div>
{/if}

{#if isLoading}
  <div class="flex justify-center my-12">
    <span class="loading loading-spinner loading-lg"></span>
  </div>
{:else}
  <div class="overflow-x-auto">
    <table class="table table-zebra w-full">
      <thead>
        <tr>
          <th>College</th>
          <th>Priority</th>
          <th>Deadline</th>
          <th>Major</th>
          <th>App Cost</th>
          <th>Cost to Attend</th>
          <th>App Type</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each colleges as college}
          {#if editingCollege === college.id}
            <tr class="bg-base-200">
              <td colspan="9">
                <div class="p-4">
                  <h3 class="font-bold mb-4">Edit College</h3>
                  {#if editFormData}
                    <form
                      on:submit|preventDefault={saveEdit}
                      class="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div class="form-control">
                        <label class="label">College Name</label>
                        <input
                          type="text"
                          bind:value={editFormData.name}
                          class="input input-bordered"
                          required
                        />
                      </div>

                      <div class="form-control">
                        <label class="label">Priority</label>
                        <select
                          bind:value={editFormData.priority}
                          class="select select-bordered"
                        >
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      </div>

                      <div class="form-control">
                        <label class="label">Application Deadline</label>
                        <input
                          type="text"
                          bind:value={editFormData.deadline}
                          class="input input-bordered"
                          required
                        />
                      </div>

                      <div class="form-control">
                        <label class="label">Major</label>
                        <input
                          type="text"
                          bind:value={editFormData.major}
                          class="input input-bordered"
                          required
                        />
                      </div>

                      <div class="form-control">
                        <label class="label">Application Cost</label>
                        <input
                          type="text"
                          bind:value={editFormData.applicationCost}
                          class="input input-bordered"
                          required
                        />
                      </div>

                      <div class="form-control">
                        <label class="label">Cost to Attend</label>
                        <input
                          type="text"
                          bind:value={editFormData.attendanceCost}
                          class="input input-bordered"
                          required
                        />
                      </div>

                      <div class="form-control">
                        <label class="label">Application Type</label>
                        <select
                          bind:value={editFormData.applicationType}
                          class="select select-bordered"
                        >
                          <option value="Early Decision">Early Decision</option>
                          <option value="Early Action">Early Action</option>
                          <option value="Regular Decision"
                            >Regular Decision</option
                          >
                          <option value="Rolling">Rolling</option>
                        </select>
                      </div>

                      <div class="form-control">
                        <label class="label">Status</label>
                        <select
                          bind:value={editFormData.status}
                          class="select select-bordered"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Submitted">Submitted</option>
                          <option value="Waitlisted">Waitlisted</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>

                      <div class="col-span-1 md:col-span-2 mt-4 flex gap-2">
                        <button type="submit" class="btn btn-primary"
                          >Save Changes</button
                        >
                        <button
                          type="button"
                          class="btn btn-ghost"
                          on:click={cancelEdit}>Cancel</button
                        >
                      </div>
                    </form>
                  {/if}
                </div>
              </td>
            </tr>
          {:else}
            <tr>
              <td>{college.name}</td>
              <td
                ><span class="badge {getPriorityColor(college.priority)}"
                  >{college.priority}</span
                ></td
              >
              <td>{college.deadline}</td>
              <td>{college.major}</td>
              <td>{college.applicationCost}</td>
              <td>{college.attendanceCost}</td>
              <td>{college.applicationType}</td>
              <td
                ><span class="badge {getStatusColor(college.status)}"
                  >{college.status}</span
                ></td
              >
              <td>
                <div class="flex space-x-2">
                  <button
                    class="btn btn-xs btn-ghost"
                    on:click={() => startEdit(college)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                  <button
                    class="btn btn-xs btn-ghost text-error"
                    on:click={() => deleteCollege(college.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
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
          {/if}
        {/each}
      </tbody>
    </table>
  </div>

  <div class="mt-8">
    <div class="stats shadow">
      <div class="stat">
        <div class="stat-figure text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div class="stat-title">Total Applications</div>
        <div class="stat-value">{colleges.length}</div>
      </div>

      <div class="stat">
        <div class="stat-figure text-success">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
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
        <div class="stat-title">Acceptances</div>
        <div class="stat-value">
          {colleges.filter((c) => c.status === "Accepted").length}
        </div>
      </div>

      <div class="stat">
        <div class="stat-figure text-warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div class="stat-title">Pending</div>
        <div class="stat-value">
          {colleges.filter(
            (c) =>
              c.status === "Pending" ||
              c.status === "Submitted" ||
              c.status === "Waitlisted",
          ).length}
        </div>
      </div>
    </div>
  </div>
{/if}
