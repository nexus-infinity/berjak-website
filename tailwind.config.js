/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        berjak: {
          // MODERN BRANDING (Berjak Design DNA - External Expression)
          gold: '#B8860B',       // Heritage gold (60+ years)
          navy: '#1A3A52',       // Professional navy
          white: '#FFFFFF',      // Clean backgrounds
          black: '#0A0E1A',      // Deep text
          gray: '#718096',       // Secondary text

          // Legacy mappings (for compatibility - WILL BE REMOVED)
          primary: '#B8860B',    // NOW: Gold (was teal)
          secondary: '#1A3A52',  // NOW: Navy (was dark gray)
          light: '#F5F5DC',      // NOW: Beige/cream (was light teal)
          lighter: '#FAFAF5',    // NOW: Off-white (was lightest teal)
          text: '#0A0E1A',       // Berjak black
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'inherit',
            a: {
              color: 'inherit',
              textDecoration: 'underline',
              fontWeight: '500',
            },
            strong: {
              color: 'inherit',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

