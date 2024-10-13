/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./index.d.ts.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary': '#F36F24',
      },
      fontFamily: {
        'sans': ['Nunito', 'sans-serif']
      },

    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}