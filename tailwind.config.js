/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography"
import daisyui from "daisyui"

export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {},
  },
  plugins: [typography, daisyui],
  daisyui: {
    themes: [
      {
        ivyhonortheme: {
          primary: "#1e3a6e",
          "primary-content": "#ffffff",
          secondary: "#4a7fb9",
          neutral: "#1e3a6e",
          "neutral-content": "#ffffff",
          accent: "#4a7fb9",
          "accent-content": "#ffffff",
          "base-content": "#333333",
          "base-100": "#ffffff",
          "base-200": "#f8f9fa",
          success: "#37d399",
          error: "#f77272",
        },
      },
    ],
  },
}
