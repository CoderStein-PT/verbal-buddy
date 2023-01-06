import tw from 'tailwind-styled-components'

const colorClasses = {
  none: '',
  white: 'text-white',
  base: 'text-gray-900 dark:text-white',
  'gray-light': 'text-gray-600 dark:text-gray-400',
  primary: 'text-primary-500',
  red: 'text-red-500'
}

const variantClasses = {
  h1: 'text-5xl md:text-7xl font-title font-bold md:leading-tight',
  h2: 'text-4xl md:text-6xl font-title font-bold md:leading-tight',
  h3: 'text-3xl md:text-5xl font-title font-bold md:leading-tight',
  h4: 'text-2xl md:text-4xl font-title font-bold',
  h5: 'text-xl md:text-3xl font-title font-bold',
  h6: 'text-lg md:text-2xl font-title font-bold',
  bodyBig: 'md:text-xl md:leading-relaxed',
  body: 'md:text-lg',
  subtitle: 'text-sm md:text-sm',
  button: 'text-base md:text-lg font-title font-bold uppercase',
  caption: 'text-xs md:text-xs font-title',
  overline: 'text-xs md:text-xs'
}

export type TextProps = {
  variant?: keyof typeof variantClasses
  color?: keyof typeof colorClasses
}

export const Text = tw.p<TextProps>`transition tw-text leading
${({ variant = 'body' }) => variantClasses[variant]}
${({ color = 'base' }) => colorClasses[color]}
`
