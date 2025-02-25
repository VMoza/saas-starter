<script lang="ts">
  import { WebsiteName } from "./../../config"
  import "../../app.css"
  import { onMount } from "svelte"
  import { fly, fade } from "svelte/transition"

  interface Props {
    children?: import("svelte").Snippet
  }

  let { children }: Props = $props()
  let scrollY = 0
  let innerHeight = 0
  let scrolled = false
  let menuOpen = false

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
  }

  function closeMenu() {
    menuOpen = false
  }
</script>

<svelte:window bind:scrollY bind:innerHeight />

<div
  class="navbar fixed top-0 z-50 transition-all duration-300 bg-white/85 {scrolled
    ? 'shadow-md py-1'
    : 'py-4'}"
  style="backdrop-filter: blur(8px)"
>
  <div class="container mx-auto px-4">
    <div class="flex-1">
      <a
        class="text-2xl font-bold text-[#1e3a6e] transition-all duration-300 hover:text-[#4a7fb9]"
        href="/"
        in:fade={{ delay: 200, duration: 400 }}
      >
        Ivy Honor
      </a>
    </div>
    <div class="flex-none">
      <ul
        class="menu menu-horizontal px-1 hidden lg:flex font-medium text-base"
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
            href="/login"
            class="hover:text-[#4a7fb9] transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#4a7fb9] after:transition-all hover:after:w-full"
          >
            Login
          </a>
        </li>
        <li class="ml-4">
          <a
            href="#schedule"
            class="bg-[#1e3a6e] hover:bg-[#152a51] text-white px-5 py-2 rounded-md transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Schedule Consultation
          </a>
        </li>
      </ul>

      <!-- Mobile menu button -->
      <button
        class="lg:hidden btn btn-ghost btn-circle"
        on:click={toggleMenu}
        aria-label="Toggle menu"
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
    class="fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-xl p-6"
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
          href="/login"
          class="block py-2 text-lg hover:text-[#4a7fb9] transition-colors duration-300"
          on:click={closeMenu}
        >
          Login
        </a>
      </li>
      <li class="mt-6">
        <a
          href="#schedule"
          class="inline-block bg-[#1e3a6e] text-white px-5 py-3 rounded-md w-full text-center font-medium"
          on:click={closeMenu}
        >
          Schedule Consultation
        </a>
      </li>
    </ul>
  </div>
{/if}

<div class="pt-24 md:pt-28">
  <slot />
</div>
