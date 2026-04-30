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
        background: "#0A1628",
        foreground: "#F8FAFC",
        primary: {
          DEFAULT: "#3B82F6",
          foreground: "#FFFFFF",
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
        },
        secondary: {
          DEFAULT: "#0F172A",
          foreground: "#F8FAFC",
        },
        accent: {
          DEFAULT: "#3B82F6",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#1E293B",
          foreground: "#94A3B8",
        },
        card: {
          DEFAULT: "#0F172A",
          foreground: "#F8FAFC",
        },
        border: "#1E293B",
        input: "#1E293B",
        ring: "#3B82F6",
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#22C55E",
          foreground: "#FFFFFF",
        },
        warning: {
          DEFAULT: "#F59E0B",
          foreground: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      fontSize: {
        "mobile-xs": ["0.8125rem", { lineHeight: "1.25rem" }],
        "mobile-sm": ["0.9375rem", { lineHeight: "1.375rem" }],
        "mobile-base": ["1rem", { lineHeight: "1.5rem" }],
        "mobile-lg": ["1.125rem", { lineHeight: "1.75rem" }],
        "mobile-xl": ["1.3125rem", { lineHeight: "1.875rem" }],
        "mobile-2xl": ["1.5rem", { lineHeight: "2rem" }],
        "mobile-3xl": ["1.875rem", { lineHeight: "2.25rem" }],
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
      spacing: {
        "touch": "2.75rem",
        "touch-lg": "3.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
