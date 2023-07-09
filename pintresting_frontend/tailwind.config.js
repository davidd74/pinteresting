/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      screens: {
        xs: "320px",
      },
      colors: {
        cta: {
          500: "#E60023",
          700: "#AD081B",
        },
      },
      boxShadow: {
        bnb: "rgba(0, 0, 0, 0.08) 0px 4px 12px",
      },
      height: ["arbitrary"],
    },
  },  
  plugins: [],
};