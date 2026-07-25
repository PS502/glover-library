/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wharton: {
          navy: "#001C4C",     // Wharton Primary Blue
          red: "#990000",      // Penn Accent Red
        },
        canvas: "#F9F8F6",     // Warm Editorial Paper (Ode Aesthetic)
        charcoal: "#1A1A1A",   // High-Contrast Text
        subtle: "#8E8E93",     // Metadata / ISBNs
      },
      fontFamily: {
        serif: ["Georgia", "serif"],
        sans: ["system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
