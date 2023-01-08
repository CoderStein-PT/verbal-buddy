const colors = require('tailwindcss/colors')
/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        title: "'Rowdies', cursive"
      },
      colors: {
        primary: colors.green,
        gray: colors.slate
      },
      boxShadow: {
        'primary-light': '0 3px 15px 0 rgba(100, 255, 100, 0.4)',
        'red-light': '0 3px 15px 0 rgba(255, 50, 50, 0.4)'
      }
    }
  },
  plugins: [
    require('@headlessui/tailwindcss'),
    require('@tailwindcss/typography')
  ]
}
