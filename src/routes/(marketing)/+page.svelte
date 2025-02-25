<script lang="ts">
  import {
    WebsiteName,
    WebsiteBaseUrl,
    WebsiteDescription,
  } from "./../../config"
  import { onMount, onDestroy } from "svelte"
  import { fade, fly, slide } from "svelte/transition"

  const ldJson = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: WebsiteName,
    url: WebsiteBaseUrl,
  }
  const jsonldScript = `<script type="application/ld+json">${
    JSON.stringify(ldJson) + "<"
  }/script>`

  let currentTestimonialIndex = 0
  const testimonials = [
    {
      quote:
        "Their personalized guidance helped me secure my spot at Stanford with confidence.",
      author: "Emma – Stanford University '26",
    },
    {
      quote:
        "The essay development services completely transformed my application. I got into my dream school!",
      author: "Michael – Harvard University '24",
    },
    {
      quote:
        "I couldn't have navigated the complicated admissions process without Ivy Honor. Worth every penny.",
      author: "Sophia – Princeton University '27",
    },
    {
      quote:
        "The strategic course planning changed my high school trajectory and made me a competitive applicant.",
      author: "James – Yale University '25",
    },
    {
      quote:
        "Ivy Honor's guidance on extracurricular development helped me stand out in a highly competitive pool.",
      author: "Aiden – Columbia University '28",
    },
    {
      quote:
        "My interview preparation sessions gave me the confidence to excel when meeting admissions officers.",
      author: "Maya – Brown University '23",
    },
    {
      quote:
        "The personalized attention to my application narrative made all the difference in my acceptance.",
      author: "Ethan – Cornell University '27",
    },
    {
      quote:
        "My counselor's insights into what specific programs were looking for helped tailor my applications perfectly.",
      author: "Olivia – UPenn '25",
    },
  ]

  function nextTestimonial() {
    currentTestimonialIndex =
      (currentTestimonialIndex + 1) % testimonials.length
  }

  function prevTestimonial() {
    currentTestimonialIndex =
      (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length
  }

  // For animations and scroll effects
  let sections = []
  let scrollY = 0

  // Intersection observer for revealing elements on scroll
  let observeIntersection: IntersectionObserver | null = null

  onMount(() => {
    // Auto-advance testimonials
    const testimonialInterval = setInterval(() => {
      nextTestimonial()
    }, 6000)

    // Create intersection observer for scroll animations
    observeIntersection = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      { threshold: 0.1 },
    )

    // Select all elements to animate
    const elementsToAnimate = document.querySelectorAll(".animate-on-scroll")
    elementsToAnimate.forEach((el) => {
      if (observeIntersection) {
        observeIntersection.observe(el)
      }
    })

    return () => {
      clearInterval(testimonialInterval)
      if (observeIntersection) {
        elementsToAnimate.forEach((el) => {
          if (observeIntersection) {
            observeIntersection.unobserve(el)
          }
        })
      }
    }
  })

  onDestroy(() => {
    if (observeIntersection) {
      observeIntersection.disconnect()
    }
  })
</script>

<svelte:head>
  <title>Ivy Honor | Elite University Admissions Consulting</title>
  <meta name="description" content={WebsiteDescription} />
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html jsonldScript}
  <style>
    /* Global styles for animation */
    .animate-on-scroll {
      opacity: 0;
      transform: translateY(30px);
      transition:
        opacity 0.6s ease-out,
        transform 0.6s ease-out;
    }
    .animate-on-scroll.visible {
      opacity: 1;
      transform: translateY(0);
    }
    .animate-delay-100 {
      transition-delay: 100ms;
    }
    .animate-delay-200 {
      transition-delay: 200ms;
    }
    .animate-delay-300 {
      transition-delay: 300ms;
    }
    .animate-delay-400 {
      transition-delay: 400ms;
    }
    .animate-delay-500 {
      transition-delay: 500ms;
    }

    /* Hero section gradient animation */
    @keyframes gradientBg {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }

    /* Testimonial slide animation */
    @keyframes fadeSlide {
      0% {
        opacity: 0;
        transform: translateX(30px);
      }
      100% {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .testimonial-enter {
      animation: fadeSlide 0.5s forwards;
    }
  </style>
</svelte:head>

<svelte:window bind:scrollY />

<!-- Hero Section -->
<section
  id="about"
  class="relative min-h-screen flex items-center justify-center overflow-hidden"
>
  <!-- Animated gradient background -->
  <div
    class="absolute inset-0 bg-gradient-to-br from-[#e8f0fe] via-[#f8f9ff] to-[#e0e7fb] opacity-80"
    style="animation: gradientBg 15s ease infinite; background-size: 400% 400%;"
  ></div>

  <!-- Decorative elements -->
  <div
    class="absolute top-20 left-10 w-64 h-64 bg-[#1e3a6e]/5 rounded-full mix-blend-multiply filter blur-3xl"
  ></div>
  <div
    class="absolute bottom-20 right-10 w-80 h-80 bg-[#4a7fb9]/10 rounded-full mix-blend-multiply filter blur-3xl"
  ></div>

  <div class="container mx-auto px-4 z-10 py-20">
    <div class="max-w-4xl mx-auto text-center">
      <div in:fade={{ duration: 1000, delay: 200 }}>
        <h1
          class="text-5xl md:text-6xl xl:text-7xl font-bold text-[#1e3a6e] mb-8 leading-tight"
        >
          Your Path to Elite University Admission
        </h1>

        <p
          class="text-lg md:text-xl xl:text-2xl mb-10 text-gray-700 max-w-3xl mx-auto leading-relaxed"
        >
          Your child deserves the very best opportunity for success. Our elite
          counseling services have placed students at Harvard, Stanford, Yale,
          and beyond.
        </p>

        <a
          href="#schedule"
          class="bg-[#1e3a6e] text-white px-8 py-4 rounded-md font-medium text-lg inline-block
                shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1
                hover:bg-[#152a51]"
        >
          Schedule a Consultation
        </a>
      </div>

      <!-- Stats preview -->
      <div
        class="flex flex-wrap justify-center gap-6 mt-16"
        in:fade={{ duration: 1000, delay: 600 }}
      ></div>
    </div>
  </div>
</section>

<!-- Path to Excellence -->
<section class="py-24 bg-white relative">
  <div class="container mx-auto px-4">
    <div class="max-w-5xl mx-auto">
      <h2
        class="text-4xl md:text-5xl font-bold text-center text-[#1e3a6e] mb-16 animate-on-scroll"
      >
        The Path to Excellence
      </h2>

      <p class="text-center text-lg max-w-3xl mx-auto mb-16 animate-on-scroll">
        The difference between admission and rejection often comes down to
        strategy and presentation. We excel at both.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div
          class="bg-slate-50 p-10 rounded-lg text-center shadow-md hover:shadow-lg transition-all duration-300 animate-on-scroll animate-delay-100 flex flex-col justify-between h-full"
        >
          <div>
            <div
              class="bg-[#1e3a6e]/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <span class="text-3xl font-bold text-[#1e3a6e]">30+</span>
            </div>
            <h3 class="text-xl font-bold text-[#1e3a6e] mb-4">
              Dream School Admissions
            </h3>
            <p class="text-gray-700">
              Our students have been accepted to the most prestigious
              institutions across the nation.
            </p>
          </div>
        </div>

        <div
          class="bg-slate-50 p-10 rounded-lg text-center shadow-md hover:shadow-lg transition-all duration-300 animate-on-scroll animate-delay-300 flex flex-col justify-between h-full"
        >
          <div>
            <div
              class="bg-[#1e3a6e]/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <span class="text-3xl font-bold text-[#1e3a6e]">100%</span>
            </div>
            <h3 class="text-xl font-bold text-[#1e3a6e] mb-4">Success Rate</h3>
            <p class="text-gray-700">
              Every student we've worked with has achieved admission to at least
              one of their target schools.
            </p>
          </div>
        </div>

        <div
          class="bg-slate-50 p-10 rounded-lg text-center shadow-md hover:shadow-lg transition-all duration-300 animate-on-scroll animate-delay-500 flex flex-col justify-between h-full"
        >
          <div>
            <div
              class="bg-[#1e3a6e]/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <span class="text-3xl font-bold text-[#1e3a6e]">10+</span>
            </div>
            <h3 class="text-xl font-bold text-[#1e3a6e] mb-4">
              Ivy League Acceptances
            </h3>
            <p class="text-gray-700">
              Our proven strategies have helped students earn acceptance to all
              eight Ivy League universities.
            </p>
          </div>
        </div>
      </div>

      <div class="text-center mt-16 max-w-4xl mx-auto animate-on-scroll">
        <p class="text-lg leading-relaxed">
          Unlike standard counselors, Ivy Honor maintains an exclusive client
          list, ensuring personalized attention for your child's journey to the
          world's most prestigious institutions.
        </p>
      </div>
    </div>
  </div>
</section>

<!-- Modern College Application Challenge -->
<section class="py-24 bg-slate-50 relative overflow-hidden">
  <!-- Decorative background elements -->
  <div
    class="absolute -top-20 -right-20 w-80 h-80 bg-[#1e3a6e]/5 rounded-full"
  ></div>
  <div
    class="absolute -bottom-20 -left-20 w-96 h-96 bg-[#4a7fb9]/5 rounded-full"
  ></div>

  <div class="container mx-auto px-4 relative z-10">
    <div class="max-w-4xl mx-auto">
      <div class="animate-on-scroll">
        <h2
          class="text-4xl md:text-5xl font-bold text-center text-[#1e3a6e] mb-8"
        >
          The Modern College Application Challenge
        </h2>

        <p class="text-lg mb-8 text-center">
          With single-digit acceptance rates at elite universities, exceptional
          academics are just the entry point. Ivy Honor provides the competitive
          edge your child needs.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-10 mt-16">
        <div class="animate-on-scroll animate-delay-200 h-full flex">
          <div
            class="bg-white p-8 rounded-lg shadow-md h-full flex flex-col min-h-[200px]"
          >
            <div
              class="w-14 h-14 bg-[#1e3a6e]/10 rounded-full flex items-center justify-center mb-6 flex-shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-6 h-6 text-[#1e3a6e]"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-[#1e3a6e] mb-4">
              Proven Track Record
            </h3>
            <p class="text-gray-700 leading-relaxed flex-grow">
              Our proven track record speaks for itself—over 30 students placed
              at Harvard, Stanford, Princeton, and other elite institutions in
              the past three years alone.
            </p>
          </div>
        </div>

        <div class="animate-on-scroll animate-delay-400 h-full flex">
          <div
            class="bg-white p-8 rounded-lg shadow-md h-full flex flex-col min-h-[200px]"
          >
            <div
              class="w-14 h-14 bg-[#1e3a6e]/10 rounded-full flex items-center justify-center mb-6 flex-shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-6 h-6 text-[#1e3a6e]"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-[#1e3a6e] mb-4">Why Choose Us</h3>
            <p class="text-gray-700 leading-relaxed flex-grow">
              When only the best will do for your child's future, Ivy Honor
              delivers results where others simply cannot.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Premium Services -->
<section id="services" class="py-24 bg-white relative">
  <div class="container mx-auto px-4">
    <h2
      class="text-4xl md:text-5xl font-bold text-center text-[#1e3a6e] mb-16 animate-on-scroll"
    >
      Our Premium Services
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      <div class="relative group animate-on-scroll animate-delay-100 h-full">
        <div
          class="bg-slate-50 p-10 rounded-lg text-center shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 h-full flex flex-col"
        >
          <div
            class="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-[#1e3a6e]/10 rounded-full group-hover:bg-[#1e3a6e]/20 transition-colors duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-8 h-8 text-[#1e3a6e]"
            >
              <path
                d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
              ></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-[#1e3a6e] mb-4">
            Strategic Course Selection
          </h3>
          <p class="text-gray-700">
            Strategic course selection tailored to your child's target
            universities, emphasizing the academic rigor elite admissions
            committees demand.
          </p>
        </div>
      </div>

      <div class="relative group animate-on-scroll animate-delay-300 h-full">
        <div
          class="bg-slate-50 p-10 rounded-lg text-center shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 h-full flex flex-col"
        >
          <div
            class="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-[#1e3a6e]/10 rounded-full group-hover:bg-[#1e3a6e]/20 transition-colors duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-8 h-8 text-[#1e3a6e]"
            >
              <path
                d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
              ></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
              ></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-[#1e3a6e] mb-4">
            Essay Development
          </h3>
          <p class="text-gray-700">
            Essay development that transforms good writing into compelling
            narratives that captivate admissions officers at the nation's most
            selective institutions.
          </p>
        </div>
      </div>

      <div class="relative group animate-on-scroll animate-delay-500 h-full">
        <div
          class="bg-slate-50 p-10 rounded-lg text-center shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 h-full flex flex-col"
        >
          <div
            class="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-[#1e3a6e]/10 rounded-full group-hover:bg-[#1e3a6e]/20 transition-colors duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-8 h-8 text-[#1e3a6e]"
            >
              <path
                d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
              ></path>
              <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
              <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
              <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-[#1e3a6e] mb-4">
            Application Strategy
          </h3>
          <p class="text-gray-700">
            Comprehensive application strategy customized for each elite
            university, leveraging our insider knowledge of what truly matters
            to admissions committees.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Success Stories -->
<section
  id="success-stories"
  class="py-24 bg-slate-50 relative overflow-hidden"
>
  <!-- Decorative elements -->
  <div
    class="absolute -top-40 -left-40 w-80 h-80 bg-[#1e3a6e]/5 rounded-full mix-blend-multiply filter blur-xl"
  ></div>
  <div
    class="absolute -bottom-40 -right-40 w-80 h-80 bg-[#4a7fb9]/5 rounded-full mix-blend-multiply filter blur-xl"
  ></div>

  <div class="container mx-auto px-4 relative z-10">
    <h2
      class="text-4xl md:text-5xl font-bold text-center text-[#1e3a6e] mb-16 animate-on-scroll"
    >
      Success Stories
    </h2>

    <div class="max-w-4xl mx-auto relative">
      <div
        class="bg-white p-10 rounded-lg shadow-md min-h-[220px] relative overflow-hidden"
      >
        <div class="text-6xl text-[#1e3a6e]/10 absolute top-4 left-6">"</div>
        <div class="relative z-10">
          <p class="text-xl italic mb-8 leading-relaxed">
            {testimonials[currentTestimonialIndex].quote}
          </p>
          <div class="flex items-center">
            <p class="font-medium text-[#1e3a6e]">
              {testimonials[currentTestimonialIndex].author}
            </p>
          </div>
        </div>
      </div>

      <div class="flex justify-between mt-8">
        <button
          on:click={prevTestimonial}
          class="bg-[#1e3a6e] text-white p-3 rounded-full shadow-md hover:bg-[#152a51] transition-colors duration-300"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div class="flex space-x-2 items-center">
          {#each testimonials as _, i}
            <button
              class="w-3 h-3 rounded-full transition-all duration-300 {i ===
              currentTestimonialIndex
                ? 'bg-[#1e3a6e] scale-125'
                : 'bg-gray-300'}"
              on:click={() => (currentTestimonialIndex = i)}
            ></button>
          {/each}
        </div>

        <button
          on:click={nextTestimonial}
          class="bg-[#1e3a6e] text-white p-3 rounded-full shadow-md hover:bg-[#152a51] transition-colors duration-300"
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</section>

<!-- Team Section -->
<!-- Commented out as requested to keep the team anonymous for now
<section id="team" class="py-24 bg-white">
  <div class="container mx-auto px-4">
    <h2
      class="text-4xl md:text-5xl font-bold text-center text-[#1e3a6e] mb-16 animate-on-scroll"
    >
      Meet Our Expert Team
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl mx-auto">
      <div class="text-center animate-on-scroll animate-delay-200">
        <img
          src="/images/vas-pic.jpeg"
          alt="Vasuman Moza"
          class="w-48 h-48 object-cover object-center rounded-full mx-auto mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300"
          style="object-position: center 25%;"
        />
        <h3 class="text-2xl font-bold text-[#1e3a6e] mb-2">Vasuman Moza</h3>
        <p class="text-gray-700 mb-2 font-medium">UC Berkeley Class of 2022</p>
        <p class="text-gray-700 mb-6">
          Computer Science & Business Administration
        </p>
        <div class="flex items-center justify-center bg-gray-50 p-3 rounded-lg">
          <img src="/images/meta-logo.png" alt="Meta" class="h-6 mr-3" />
          <p class="font-medium">Software Engineer at Meta</p>
          <a
            href="https://www.linkedin.com/in/vasumanmoza"
            target="_blank"
            rel="noopener noreferrer"
            class="ml-3 bg-[#0072b1] p-1.5 rounded-md hover:bg-[#005d93] transition-colors duration-300"
            aria-label="Vasuman's LinkedIn Profile"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
              />
            </svg>
          </a>
        </div>
      </div>

      <div class="text-center animate-on-scroll animate-delay-400">
        <img
          src="/images/shriya-pic.jpg"
          alt="Shriya Nandwani"
          class="w-48 h-48 object-cover object-center rounded-full mx-auto mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300"
          style="object-position: center 22%; object-fit: cover; scale: 1.05;"
        />
        <h3 class="text-2xl font-bold text-[#1e3a6e] mb-2">Shriya Nandwani</h3>
        <p class="text-gray-700 mb-2 font-medium">UC Berkeley Class of 2022</p>
        <p class="text-gray-700 mb-6">Computer Science & Creative Writing</p>
        <div class="flex items-center justify-center bg-gray-50 p-3 rounded-lg">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
            alt="Google"
            class="h-6 mr-3"
          />
          <p class="font-medium">Software Engineer at Google</p>
          <a
            href="https://www.linkedin.com/in/shriyanan"
            target="_blank"
            rel="noopener noreferrer"
            class="ml-3 bg-[#0072b1] p-1.5 rounded-md hover:bg-[#005d93] transition-colors duration-300"
            aria-label="Shriya's LinkedIn Profile"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
-->

<!-- Contact Form -->
<section id="schedule" class="py-24 bg-slate-50 relative overflow-hidden">
  <!-- Decorative elements -->
  <div
    class="absolute -top-20 right-0 w-72 h-72 bg-[#1e3a6e]/5 rounded-full mix-blend-multiply filter blur-xl"
  ></div>
  <div
    class="absolute -bottom-20 left-0 w-72 h-72 bg-[#4a7fb9]/5 rounded-full mix-blend-multiply filter blur-xl"
  ></div>

  <div class="container mx-auto px-4 relative z-10">
    <div class="max-w-xl mx-auto">
      <div class="text-center mb-16 animate-on-scroll">
        <span
          class="inline-block py-1 px-3 rounded-full bg-[#1e3a6e]/10 text-[#1e3a6e] text-sm font-medium mb-4"
        >
          Get Started Today
        </span>
        <h2 class="text-4xl md:text-5xl font-bold text-[#1e3a6e] mb-6">
          Schedule Your Private Consultation
        </h2>
        <p class="text-lg text-gray-700">
          Limited spots available. Secure your child's future with our premium
          admissions consulting services.
        </p>
      </div>

      <div class="bg-white p-8 md:p-10 rounded-xl shadow-lg animate-on-scroll">
        <form class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                for="parent-name"
                class="block text-gray-700 font-medium mb-2"
                >Parent's Name</label
              >
              <input
                type="text"
                id="parent-name"
                class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a6e] focus:border-transparent transition-all duration-300"
                placeholder="John Smith"
              />
            </div>

            <div>
              <label
                for="parent-email"
                class="block text-gray-700 font-medium mb-2"
                >Parent's Email</label
              >
              <input
                type="email"
                id="parent-email"
                class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a6e] focus:border-transparent transition-all duration-300"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label
              for="phone-number"
              class="block text-gray-700 font-medium mb-2">Phone Number</label
            >
            <input
              type="tel"
              id="phone-number"
              class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a6e] focus:border-transparent transition-all duration-300"
              placeholder="(123) 456-7890"
            />
          </div>

          <div>
            <label
              for="student-name"
              class="block text-gray-700 font-medium mb-2">Student's Name</label
            >
            <input
              type="text"
              id="student-name"
              class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a6e] focus:border-transparent transition-all duration-300"
              placeholder="Sarah Smith"
            />
          </div>

          <div>
            <label for="grade" class="block text-gray-700 font-medium mb-2"
              >Select Grade</label
            >
            <select
              id="grade"
              class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a6e] focus:border-transparent transition-all duration-300 bg-white"
            >
              <option value="" disabled selected>Select Grade</option>
              <option value="9">9th Grade</option>
              <option value="10">10th Grade</option>
              <option value="11">11th Grade</option>
              <option value="12">12th Grade</option>
            </select>
          </div>

          <button
            type="submit"
            class="w-full bg-[#1e3a6e] text-white py-4 rounded-md font-medium text-lg
                shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1
                hover:bg-[#152a51]">Schedule Consultation</button
          >

          <p class="text-center text-gray-500 text-sm mt-6">
            By submitting this form, you agree to our privacy policy and terms
            of service.
          </p>
        </form>
      </div>
    </div>
  </div>
</section>
