/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customBlue: {
          DEFAULT: '#1e3a8a',  // This is for 'customBlue'
          700: '#1c2f6f',      // This is for 'customBlue-700'
        },
        customGrey: {
          DEFAULT: "#C8C8C8",
          300: "#C8C8C8",
        },
        customCardBlue: {
          DEFAULT: "#3754B9",
          700: "#3754B9",
        },
      },
    },
  },
  plugins: [],
}
