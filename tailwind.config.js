/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Comfortable eye-soothing canvas
        canvas: {
          light: '#F8F9FA',
          dark: '#15171C',
        },
        // Elevated surfaces
        surface: {
          light: '#FFFFFF',
          dark: '#1E2026',
        },
        surfaceAlt: {
          light: '#F1F3F5',
          dark: '#272A32',
        },
        // Low-contrast borders
        borderLine: {
          light: '#E2E8F0',
          dark: '#2B2E37',
        },
        // Gentle Sage / Teal brand accents (comfortable, not harsh neon blue)
        sage: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
          950: '#042F2E',
        },
        // Warm Stone & Slate
        neutral: {
          50: '#F8F9FA',
          100: '#F1F3F5',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E2026',
          850: '#1A1C22',
          900: '#15171C',
          950: '#101216',
        },
      },
    },
  },
  plugins: [],
};
