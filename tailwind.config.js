/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#050816",
          50: "#0A0F24",
          100: "#0D1330",
          200: "#11183C",
        },
        electric: "#2563EB",
        violet: "#7C3AED",
        signal: "#22D3EE",
        ice: "#F8FAFC",
        slate: {
          soft: "#94A3B8",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "grad-primary": "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
        "grad-radial-glow":
          "radial-gradient(circle at 50% 0%, rgba(37,99,235,0.18), transparent 60%)",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(5, 8, 22, 0.55)",
        glow: "0 0 40px rgba(37, 99, 235, 0.25)",
      },
    },
  },
  plugins: [],
};
