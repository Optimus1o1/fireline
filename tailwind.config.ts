import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ember: {
          bg: "#08090B",
          subtle: "#101216",
          surface: "#17191F",
          card: "rgba(23, 25, 31, 0.75)",
          border: "rgba(255, 255, 255, 0.08)",
          borderHover: "rgba(255, 96, 74, 0.35)",
        },
        flame: {
          DEFAULT: "#E53935",
          bright: "#FF604A",
          glow: "rgba(229, 57, 53, 0.25)",
          dim: "#9E2A2B",
        },
        paper: {
          DEFAULT: "#F5F3F0",
          muted: "#A1A1AA",
          dim: "#71717A",
        },
        amberGold: {
          DEFAULT: "#F5A742",
          dim: "rgba(245, 167, 66, 0.2)",
        },
        status: {
          supported: "#10B981",
          inferred: "#F59E0B",
          gap: "#E53935",
        },
        // Backward compatibility mappings
        ink: "#08090B",
        bone: "#F5F3F0",
        copper: "#FF604A",
        slate: "#A1A1AA",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "'SF Mono'",
          "Menlo",
          "Monaco",
          "Consolas",
          "'Liberation Mono'",
          "'Courier New'",
          "monospace",
        ],
      },
      boxShadow: {
        ember: "0 0 25px -5px rgba(229, 57, 53, 0.25)",
        "ember-sm": "0 0 15px -3px rgba(229, 57, 53, 0.2)",
        "ember-lg": "0 0 50px -10px rgba(255, 96, 74, 0.3)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
    },
  },
  plugins: [],
};

export default config;
