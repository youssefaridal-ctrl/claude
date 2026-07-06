import type { Config } from "tailwindcss";

/**
 * Tailwind theme mapped 1:1 to the Blueprint design tokens
 * (design/04-ui-design-system.md). Raw brand scales (ink/bone/solar)
 * are available directly; semantic tokens (background, surface, …)
 * resolve through CSS variables so dark/light/high-contrast themes
 * swap at the :root level.
 */
const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    container: { center: true, padding: "1.5rem", screens: { "2xl": "1200px" } },
    extend: {
      colors: {
        ink: {
          100: "#DDD9D1",
          300: "#A9A399",
          500: "#6B665C",
          700: "#33302A",
          800: "#211F1B",
          900: "#161512",
          950: "#0E0D0B",
        },
        bone: { 50: "#FAF8F4", 100: "#F2EFE8", 200: "#E7E2D8" },
        solar: { 500: "#E8A23D", 600: "#B4741A", 700: "#8A5810" },
        positive: "hsl(var(--positive))",
        caution: "hsl(var(--caution))",
        attention: "hsl(var(--attention))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--foreground))",
        },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--attention))", foreground: "hsl(var(--background))" },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        // Fluid display scale (design/04 §2.2)
        "display-xl": ["clamp(2.75rem, 6vw, 5.5rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        "display-l": ["clamp(2.25rem, 4.5vw, 4rem)", { lineHeight: "1.05", letterSpacing: "-0.015em" }],
        "display-m": ["clamp(1.875rem, 3vw, 2.75rem)", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
        "heading-s": ["clamp(1.375rem, 2vw, 1.75rem)", { lineHeight: "1.25", letterSpacing: "-0.005em" }],
        "serif-feature": ["clamp(1.5rem, 2.2vw, 2rem)", { lineHeight: "1.4" }],
        "body-l": ["1.25rem", { lineHeight: "1.7" }],
        "body-m": ["1.0625rem", { lineHeight: "1.6" }],
        "body-s": ["0.9375rem", { lineHeight: "1.55" }],
        "label-mono": ["0.8125rem", { lineHeight: "1.4", letterSpacing: "0.08em" }],
      },
      borderRadius: {
        r1: "6px",
        r2: "10px",
        r3: "16px",
        r4: "24px",
      },
      spacing: {
        // s-scale aliases for layout rhythm (design/04 §4)
        s7: "3rem",
        s8: "4rem",
        s9: "6rem",
        s10: "8rem",
        s11: "10rem",
        s12: "15rem",
      },
      boxShadow: {
        "elev-1": "0 1px 2px rgb(14 13 11 / 0.06), 0 2px 8px rgb(14 13 11 / 0.04)",
        "elev-2": "0 4px 12px rgb(14 13 11 / 0.06), 0 12px 32px rgb(14 13 11 / 0.06)",
        "elev-3": "0 8px 24px rgb(14 13 11 / 0.08), 0 32px 80px rgb(14 13 11 / 0.10)",
        "glow-solar": "0 0 48px rgb(232 162 61 / 0.10)",
      },
      transitionTimingFunction: {
        "out-quart": "cubic-bezier(0.25, 1, 0.5, 1)",
        "in-quart": "cubic-bezier(0.5, 0, 0.75, 0)",
      },
      transitionDuration: { fast: "150ms", base: "250ms", slow: "400ms" },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
