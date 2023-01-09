/** @type {import('tailwindcss/colors')} */
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
      transitionTimingFunction: {
        cool: 'cubic-bezier(0.4, 0, 0.41, 1.57)'
      },
      boxShadow: {
        'primary-light': '0 3px 15px 0 rgba(100, 255, 100, 0.4)',
        'red-light': '0 3px 15px 0 rgba(255, 50, 50, 0.4)'
      },
      typography: ({ theme }) => ({
        slate: {
          css: {
            '--tw-prose-bullets': theme('colors.primary[500]'),
            '--tw-prose-invert-bullets': theme('colors.primary[500]'),
            '--tw-prose-invert-body': theme('colors.slate[400]'),
            '--tw-prose-invert-headings': theme('colors.slate[200]'),
            '--tw-prose-invert-quote-borders': theme('colors.primary.500'),
            'h1, h2, h3, h4, h5, h6': {
              fontFamily: theme('fontFamily[title]'),
              fontWeight: 400,
              letterSpacing: '0.05rem',
              'scroll-margin-top': '4rem'
            },
            ul: {
              listStyleType: 'none'
            },
            'ul > li': {
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
              position: 'relative',
              lineHeight: '1.5'
            },
            'ul > li::before': {
              content: '""',
              width: '0.35em',
              height: '0.35em',
              position: 'absolute',
              transform: 'rotate(45deg)',
              top: '0.6rem',
              left: '-1rem',
              backgroundColor: theme('colors.primary.500')
            },
            hr: {
              marginTop: '1em',
              marginBottom: '1em'
            },
            '--tw-prose-invert-bold': theme('colors.slate.200')
          }
        }
      })
    }
  },
  plugins: [
    require('@headlessui/tailwindcss'),
    require('@tailwindcss/typography')
  ]
}
