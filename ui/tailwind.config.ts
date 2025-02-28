import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      colors: {
        border: {
          DEFAULT: "hsl(var(--border))",
          light: "hsl(var(--border-light))",
        },
        input: {
          DEFAULT: "hsl(var(--input))",
          light: "hsl(var(--input-light))",
        },
        ring: {
          DEFAULT: "hsl(var(--ring))",
          light: "hsl(var(--ring-light))",
        },
        background: {
          DEFAULT: "hsl(var(--background))",
          light: "hsl(var(--background-light))",
        },
        foreground: {
          DEFAULT: "hsl(var(--foreground))",
          light: "hsl(var(--foreground-light))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          light: "hsl(var(--primary-light))",
          "foreground-light": "hsl(var(--primary-foreground-light))",
          hover: "hsl(var(--primary-hover))",
          "hover-light": "hsl(var(--primary-hover-light))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          light: "hsl(var(--secondary-light))",
          "foreground-light": "hsl(var(--secondary-foreground-light))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
          light: "hsl(var(--muted-light))",
          "foreground-light": "hsl(var(--muted-foreground-light))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          light: "hsl(var(--accent-light))",
          "foreground-light": "hsl(var(--accent-foreground-light))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
          light: "hsl(var(--popover-light))",
          "foreground-light": "hsl(var(--popover-foreground-light))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
          light: "hsl(var(--card-light))",
          "foreground-light": "hsl(var(--card-foreground-light))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
