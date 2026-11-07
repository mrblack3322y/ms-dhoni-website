/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        surface: "#111111",
        surfaceDark: "#080808",
        gold: {
          DEFAULT: "#D4AF66",
          light: "#F0D394",
          dark: "#AA8535",
          shimmer: "#FFF2C8",
        },
        csk: {
          yellow: "#FDB913",
          darkYellow: "#E5A405",
          glow: "#FFE482",
          dark: "#0a0a00",
        },
        grey: {
          muted: "#888888",
          subtle: "#333333",
          light: "#CCCCCC",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        display: ["Cinzel", "Impact", "Georgia", "serif"],
        editorial: ["Playfair Display", "Georgia", "serif"],
        mono: ["JetBrains Mono", "Courier New", "monospace"],
      },
      letterSpacing: {
        widestx: "0.25em",
        ultra: "0.35em",
      },
    },
  },
  plugins: [],
};
