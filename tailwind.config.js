/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        _fav: {
          "60%": { scale: "1.2" },
          "100%": { scale: "1" },
        },
        _popover: {
          "0%": { opacity: 0, translate: "0 -10px" },
          "10%": { opacity: 1, translate: "0" },
          "90%": { opacity: 1, translate: "0" },
          "100%": { opacity: 0, translate: "0 10px" },
        },
      },
      animation: {
        favorited: "_fav 0.25s ease-in-out 0s",
        popover: "1.5s ease-in-out 0s 1 normal forwards running _popover",
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
