/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
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