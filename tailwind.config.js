/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        _fav: {
          "60%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)" },
        },
        _popover: {
          "0%": { opacity: 0, transform: "translateY(-10px)" },
          "10%": { opacity: 1, transform: "translateY(0)" },
          "90%": { opacity: 1, transform: "translateY(0)" },
          "100%": { opacity: 0, transform: "translateY(10px)" },
        },
      },
      animation: {
        favorited: "_fav 0.25s ease-in-out",
        popover: "1.5s ease-in-out 0s 1 normal forwards running _popover",
      },
    },
  },
  plugins: [],
};
