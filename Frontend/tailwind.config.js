/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#128cb1",
        secondary: "#00A1D6",
        admin: "#6b48ff",
      },
      fontFamily: {
        roboto: ["Roboto", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};