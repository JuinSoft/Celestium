/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        'celestial-blue': '#1E3C72',
        'celestial-indigo': '#2A5298',
        'celestial-purple': '#7045AF',
        'celestial-pink': '#FF4C8B',
        'stellar-yellow': '#FCE94A'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-stellar': 'linear-gradient(to right, #1E3C72, #2A5298, #7045AF)',
      },
    },
  },
  plugins: [],
} 