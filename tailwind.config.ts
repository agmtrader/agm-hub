/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
      },
    },
    extend: {
      rotate: {
        '30': '30deg',
        '60': '60deg',
        '90': '90deg',
        '120': '120deg'
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          light: '#38BAF2',
          DEFAULT: '#F26C0D',
          dark:'#122c45'
        },
        secondary: {
          light: '#5996C0',
          DEFAULT: '#2571A5',
          dark:'#062D47'
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
        },
        subtitle: {
          DEFAULT: "hsl(var(--subtitle))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "rotate-x-90": {
          from: { transform: 'rotateX(0deg)' },
          to: { transform: 'rotateX(90deg)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "rotate-x-90": "rotate-x-90 0.1s linear",
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}
