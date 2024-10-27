// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        garamond: ["EB Garamond", "serif"],
        lora: ["Lora", "serif"],
      },
    },
  },
  plugins: [],
};
