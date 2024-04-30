/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': presetPrimaryColors.blue,
        'secondary': presetPrimaryColors.indigo,
        'warning': presetPrimaryColors.red
      },
      fontFamily: {
        'sans': ['Poppins', 'sans-serif']
      }
    },
  },
  plugins: [],
}