/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/App.js', './src/components/Input.js'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
}
