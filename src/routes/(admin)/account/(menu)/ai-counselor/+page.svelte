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

  adminSectionStore.set("ai-counselor")

  let prompt = ""
  let school = ""
  let wordCount = 500
  let existingEssay = ""
  let result = ""
  let isLoading = false
  let error = ""

  async function generateEssay() {
    if (!prompt || !school || !wordCount) {
      error = "Please fill in all required fields"
      return
    }

    error = ""
    isLoading = true

    try {
      const response = await fetch("/api/ai-counselor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          school,
          wordCount,
          existingEssay: existingEssay || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate essay")
      }

      const data = await response.json()
      result = data.essay
    } catch (err: any) {
      error = err.message || "An error occurred"
    } finally {
      isLoading = false
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(result)
  }
</script>

<div class="py-6">
  <h1 class="text-3xl font-bold mb-6">AI Counselor Agent</h1>

  <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title mb-4">Essay Generator</h2>

        {#if error}
          <div class="alert alert-error mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              /></svg
            >
            <span>{error}</span>
          </div>
        {/if}

        <form on:submit|preventDefault={generateEssay} class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Essay Prompt *</span>
            </label>
            <textarea
              bind:value={prompt}
              class="textarea textarea-bordered h-24"
              placeholder="Enter the essay prompt or question"
              required
            ></textarea>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">School/University *</span>
            </label>
            <input
              type="text"
              bind:value={school}
              class="input input-bordered"
              placeholder="Enter the school or university name"
              required
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Word Count *</span>
            </label>
            <input
              type="number"
              bind:value={wordCount}
              class="input input-bordered"
              min="100"
              max="2000"
              required
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Existing Essay (Optional)</span>
              <span class="label-text-alt"
                >If provided, the AI will edit this essay instead of creating a
                new one</span
              >
            </label>
            <textarea
              bind:value={existingEssay}
              class="textarea textarea-bordered h-32"
              placeholder="Enter your existing essay if you want the AI to edit it"
            ></textarea>
          </div>

          <div class="form-control mt-6">
            <button type="submit" class="btn btn-primary" disabled={isLoading}>
              {#if isLoading}
                <span class="loading loading-spinner"></span>
                Generating...
              {:else}
                {existingEssay ? "Edit Essay" : "Generate Essay"}
              {/if}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="flex justify-between items-center mb-4">
          <h2 class="card-title">Result</h2>
          {#if result}
            <button class="btn btn-sm btn-outline" on:click={copyToClipboard}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
              Copy
            </button>
          {/if}
        </div>

        {#if result}
          <div
            class="bg-base-200 p-4 rounded-lg h-[500px] overflow-y-auto whitespace-pre-wrap"
          >
            {result}
          </div>
        {:else}
          <div
            class="bg-base-200 p-4 rounded-lg h-[500px] flex items-center justify-center text-base-content/50"
          >
            Your essay will appear here after generation
          </div>
        {/if}

        {#if result}
          <div class="text-sm text-base-content/70 mt-2">
            Word count: {result.split(/\s+/).filter(Boolean).length}
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
