<script lang="ts">
  import { WebsiteName } from "./../../config"
  import "../../app.css"
  import { onMount } from "svelte"
  import { fly, fade } from "svelte/transition"
  import { page } from "$app/stores"

  interface Props {
    children?: import("svelte").Snippet
    data?: any
  }

  let { children, data }: Props = $props()
  let scrollY = 0
  let innerHeight = 0
  let scrolled = false
  let menuOpen = false

  // Check if user is logged in
  const isLoggedIn = $derived(
    $page.data?.session !== null && $page.data?.session !== undefined,
  )

  // Get user initial if available
  const userInitial = $derived(
    $page.data?.user?.email?.[0]?.toUpperCase() || "U",
  )

  onMount(() => {
    const handleScroll = () => {
      scrollY = window.scrollY
      scrolled = window.scrollY > 50
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  })

  function toggleMenu() {
    menuOpen = !menuOpen
    console.log("Menu toggled:", menuOpen)
  }

  function closeMenu() {
    menuOpen = false
    console.log("Menu closed")
  }
</script>

<svelte:window bind:scrollY bind:innerHeight />

<div
  class="navbar fixed top-0 z-50 transition-all duration-300 bg-white/85 {scrolled
    ? 'shadow-md py-1'
    : 'py-4'}"
  style="backdrop-filter: blur(8px)"
>
  <div class="container mx-auto px-4 flex items-center justify-between">
    <div class="flex-1">
      <a
        class="text-2xl font-bold text-[#1e3a6e] transition-all duration-300 hover:text-[#4a7fb9]"
        href="/"
        in:fade={{ delay: 200, duration: 400 }}
      >
        Ivy Honor
      </a>
    </div>
    <div class="flex items-center">
      <ul
        class="menu menu-horizontal px-1 hidden lg:flex font-medium text-base items-center"
      >
        <li class="mx-2">
          <a
            href="/pricing"
            class="hover:text-[#4a7fb9] transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#4a7fb9] after:transition-all hover:after:w-full"
          >
            Pricing
          </a>
        </li>
        <li class="mx-2">
          <a
            href="#schedule"
            class="hover:text-[#4a7fb9] transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#4a7fb9] after:transition-all hover:after:w-full"
          >
            Schedule Consultation
          </a>
        </li>
        {#if isLoggedIn}
          <li class="ml-4">
            <a
              href="/account"
              class="flex items-center gap-2 hover:text-[#4a7fb9] transition-colors duration-300"
            >
              <div
                class="w-9 h-9 bg-[#1e3a6e] rounded-full flex items-center justify-center shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-white"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <span>My Account</span>
            </a>
          </li>
        {:else}
          <li class="ml-4">
            <a
              href="/login"
              class="bg-[#1e3a6e] hover:bg-[#152a51] text-white px-5 py-2 rounded-md transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Login
            </a>
          </li>
        {/if}
      </ul>

      <!-- Mobile menu button -->
      <button
        class="lg:hidden btn btn-ghost btn-circle flex items-center justify-center"
        on:click={toggleMenu}
        aria-label="Toggle menu"
        style="min-height: 2.5rem; height: 2.5rem; min-width: 2.5rem; width: 2.5rem;"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h7"}
          />
        </svg>
      </button>
    </div>
  </div>
</div>

<!-- Mobile menu -->
{#if menuOpen}
  <div
    class="fixed inset-0 bg-black/50 z-40"
    on:click={closeMenu}
    transition:fade={{ duration: 200 }}
  ></div>

  <div
    class="fixed top-0 right-0 h-full w-[80%] max-w-xs bg-white z-50 shadow-xl p-6 overflow-y-auto"
    transition:fly={{ x: 300, duration: 300 }}
  >
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-xl font-bold text-[#1e3a6e]">Ivy Honor</h2>
      <button
        class="btn btn-ghost btn-sm btn-circle"
        on:click={closeMenu}
        aria-label="Close menu"
      >
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <ul class="space-y-4">
      <li>
        <a
          href="/pricing"
          class="block py-2 text-lg hover:text-[#4a7fb9] transition-colors duration-300"
          on:click={closeMenu}
        >
          Pricing
        </a>
      </li>
      <li>
        <a
          href="/#schedule"
          class="block py-2 text-lg hover:text-[#4a7fb9] transition-colors duration-300"
          on:click={() => {
            closeMenu()
            if (window.location.pathname === "/") {
              const element = document.getElementById("schedule")
              if (element) {
                element.scrollIntoView({ behavior: "smooth" })
              }
            }
          }}
        >
          Schedule Consultation
        </a>
      </li>
      {#if isLoggedIn}
        <li>
          <a
            href="/account"
            class="block py-2 text-lg hover:text-[#4a7fb9] transition-colors duration-300 flex items-center gap-2"
            on:click={closeMenu}
          >
            <div
              class="w-9 h-9 bg-[#1e3a6e] rounded-full flex items-center justify-center shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-white"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <span>My Account</span>
          </a>
        </li>
      {:else}
        <li class="mt-6">
          <a
            href="/login"
            class="inline-block bg-[#1e3a6e] text-white px-5 py-3 rounded-md w-full text-center font-medium"
            on:click={closeMenu}
          >
            Login
          </a>
        </li>
      {/if}
    </ul>
  </div>
{/if}

<div class="pt-24 md:pt-28">
  <slot />
</div>
