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
        // 'secondary': presetPrimaryColors.indigo,
        // 'success': presetPrimaryColors.green,
        // 'danger': presetPrimaryColors.red,
        // 'warning': presetPrimaryColors.red
      },
      fontFamily: {
        'sans': ['Poppins', 'sans-serif']
      }
    },
  },
  plugins: [],
}