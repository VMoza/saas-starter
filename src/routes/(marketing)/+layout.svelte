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
            href="#about"
            class="hover:text-[#4a7fb9] transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#4a7fb9] after:transition-all hover:after:w-full"
          >
            About
          </a>
        </li>
        <li class="mx-2">
          <a
            href="#services"
            class="hover:text-[#4a7fb9] transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#4a7fb9] after:transition-all hover:after:w-full"
          >
            Services
          </a>
        </li>
        <li class="mx-2">
          <a
            href="#success-stories"
            class="hover:text-[#4a7fb9] transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#4a7fb9] after:transition-all hover:after:w-full"
          >
            Success Stories
          </a>
        </li>
        <li class="mx-2">
          <a
            href="#results"
            class="hover:text-[#4a7fb9] transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#4a7fb9] after:transition-all hover:after:w-full"
          >
            Results
          </a>
        </li>
        <li class="mx-2">
          <a
            href="#team"
            class="hover:text-[#4a7fb9] transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#4a7fb9] after:transition-all hover:after:w-full"
          >
            Team
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
          href="#about"
          class="block py-2 text-lg hover:text-[#4a7fb9] transition-colors duration-300"
          on:click={closeMenu}
        >
          About
        </a>
      </li>
      <li>
        <a
          href="#services"
          class="block py-2 text-lg hover:text-[#4a7fb9] transition-colors duration-300"
          on:click={closeMenu}
        >
          Services
        </a>
      </li>
      <li>
        <a
          href="#success-stories"
          class="block py-2 text-lg hover:text-[#4a7fb9] transition-colors duration-300"
          on:click={closeMenu}
        >
          Success Stories
        </a>
      </li>
      <li>
        <a
          href="#results"
          class="block py-2 text-lg hover:text-[#4a7fb9] transition-colors duration-300"
          on:click={closeMenu}
        >
          Results
        </a>
      </li>
      <li>
        <a
          href="#team"
          class="block py-2 text-lg hover:text-[#4a7fb9] transition-colors duration-300"
          on:click={closeMenu}
        >
          Team
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

<footer class="bg-[#1e3a6e] text-white mt-20">
  <div class="container mx-auto px-4 py-16">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
      <div>
        <h3 class="text-2xl font-bold mb-6 relative">
          Ivy Honor
          <span class="block w-16 h-1 bg-[#4a7fb9] mt-2"></span>
        </h3>
        <p class="max-w-xs text-gray-300 leading-relaxed">
          Your path to elite university admission starts here. Transform your
          college application journey with our premium counseling services.
        </p>
      </div>
      <div>
        <h3 class="text-xl font-bold mb-6 relative">
          Quick Links
          <span class="block w-16 h-1 bg-[#4a7fb9] mt-2"></span>
        </h3>
        <ul class="space-y-3">
          <li>
            <a
              href="#about"
              class="text-gray-300 hover:text-white transition-colors duration-300 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
              About Us
            </a>
          </li>
          <li>
            <a
              href="#services"
              class="text-gray-300 hover:text-white transition-colors duration-300 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
              Services
            </a>
          </li>
          <li>
            <a
              href="#success-stories"
              class="text-gray-300 hover:text-white transition-colors duration-300 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
              Success Stories
            </a>
          </li>
          <li>
            <a
              href="#team"
              class="text-gray-300 hover:text-white transition-colors duration-300 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
              Our Team
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h3 class="text-xl font-bold mb-6 relative">
          Contact Us
          <span class="block w-16 h-1 bg-[#4a7fb9] mt-2"></span>
        </h3>
        <ul class="space-y-3">
          <li class="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-3 mt-0.5 text-[#4a7fb9]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <a
              href="mailto:info@ivyhonor.com"
              class="text-gray-300 hover:text-white transition-colors duration-300"
              >info@ivyhonor.com</a
            >
          </li>
          <li class="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-3 mt-0.5 text-[#4a7fb9]"
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
            <a
              href="tel:+1234567890"
              class="text-gray-300 hover:text-white transition-colors duration-300"
              >(123) 456-7890</a
            >
          </li>
          <li class="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-3 mt-0.5 text-[#4a7fb9]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span class="text-gray-300">San Francisco, CA</span>
          </li>
        </ul>

        <div class="mt-8">
          <h4 class="text-base font-semibold mb-4">Follow Us</h4>
          <div class="flex space-x-4">
            <a
              href="#"
              class="bg-[#11254d] hover:bg-[#4a7fb9] transition-colors duration-300 h-10 w-10 rounded-full flex items-center justify-center"
              aria-label="Twitter"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                class="fill-current"
              >
                <path
                  d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
                ></path>
              </svg>
            </a>
            <a
              href="#"
              class="bg-[#11254d] hover:bg-[#4a7fb9] transition-colors duration-300 h-10 w-10 rounded-full flex items-center justify-center"
              aria-label="Facebook"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                class="fill-current"
              >
                <path
                  d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"
                ></path>
              </svg>
            </a>
            <a
              href="#"
              class="bg-[#11254d] hover:bg-[#4a7fb9] transition-colors duration-300 h-10 w-10 rounded-full flex items-center justify-center"
              aria-label="Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                class="fill-current"
              >
                <path
                  d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="border-t border-[#11254d] py-6">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <p class="text-sm text-gray-400">
          © 2023 Ivy Honor - All rights reserved
        </p>
        <div class="mt-4 md:mt-0">
          <ul class="flex space-x-6 text-sm text-gray-400">
            <li>
              <a
                href="#"
                class="hover:text-white transition-colors duration-300"
                >Privacy Policy</a
              >
            </li>
            <li>
              <a
                href="#"
                class="hover:text-white transition-colors duration-300"
                >Terms of Service</a
              >
            </li>
            <li>
              <a
                href="#"
                class="hover:text-white transition-colors duration-300"
                >Cookie Policy</a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</footer>
