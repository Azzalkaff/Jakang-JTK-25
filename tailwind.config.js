/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
          sans: ['Nunito', 'sans-serif'],
      },
      colors: {
          md: {
              primary: '#0072CE',        /* Blue */
              onPrimary: '#FFFFFF',
              primaryContainer: '#D1E4FF',
              onPrimaryContainer: '#001D36',
              secondary: '#E1D9CD',      /* Beige */
              onSecondary: '#1A202C',
              background: '#F8F9FA',     /* Light Greyish Background */
              surface: '#FFFFFF',        /* White Cards */
              surfaceVariant: '#F2EFE9', /* Slightly darker surface for grouping */
              outline: '#74777F',
              textMain: '#1A1C1E',
              textMuted: '#43474E'
          }
      },
      boxShadow: {
          'md-1': '0 1px 2px 0 rgba(0,0,0,0.3), 0 1px 3px 1px rgba(0,0,0,0.15)',
          'md-2': '0 1px 2px 0 rgba(0,0,0,0.3), 0 2px 6px 2px rgba(0,0,0,0.15)',
          'md-3': '0 1px 3px 0 rgba(0,0,0,0.3), 0 4px 8px 3px rgba(0,0,0,0.15)',
      }
    }
  },
  plugins: [],
}
