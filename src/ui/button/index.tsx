import React, { PropsWithChildren } from 'react'
import tw from 'tailwind-styled-components'
import { Loading, Text, TextProps } from 'ui'

const sizeClasses = {
  round: 'p-2 rounded-full',
  sm: 'py-1 px-3 rounded-lg',
  md: 'py-1 px-3 rounded-lg',
  base: 'py-2 px-6 rounded-xl',
  lg: 'py-3 px-6 rounded-2xl',
  xl: 'py-4 px-8 text-lg rounded-2xl',
  icon: 'md:p-0.5 p-1.5 rounded-full'
}

const textSizeVariants: Record<string, TextProps['variant']> = {
  sm: 'subtitle',
  md: 'subtitle2',
  base: 'button',
  lg: 'button',
  xl: 'button',
  round: 'button',
  icon: 'subtitle'
}

const colorClasses = {
  primary:
    'text-slate-200 bg-primary-500 border border-transparent hover:bg-primary-400 dark:bg-transparent dark:text-primary-500 dark:border-primary-500 dark:hover:bg-primary-500 dark:hover:text-white dark:hover:shadow-primary-light',
  gray: 'text-gray-800 bg-gray-100 border border-gray-300 hover:bg-gray-200 dark:bg-transparent dark:text-slate-200 dark:border-gray-500 dark:hover:bg-gray-500 dark:hover:text-white',
  grayPrimary:
    'text-gray-800 bg-gray-100 border border-gray-300 hover:bg-primary-500 dark:bg-transparent dark:text-slate-200 dark:border-gray-500 dark:hover:bg-primary-500 dark:hover:border-primary-500 dark:hover:text-white dark:hover:shadow-primary-light',
  text: 'text-gray-800 dark:text-slate-200 dark:hover:text-primary-500',
  textPrimary: 'text-primary-500',
  red: 'text-gray-800 bg-red-100 border border-red-300 hover:bg-red-200 dark:bg-transparent dark:text-red-500 dark:border-red-500 dark:hover:bg-red-500 dark:hover:text-white dark:hover:shadow-red-light'
}

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: keyof typeof sizeClasses
  color?: keyof typeof colorClasses
  disabled?: boolean
  isLoading?: boolean
}

export const ButtonCore = tw.button<ButtonProps>`
  relative flex items-center justify-center transition ease-out appearance-none whitespace-nowrap group select-none outline-none
  ${({ size = 'base', color = 'primary', disabled }) =>
    `${sizeClasses[size]} ${colorClasses[disabled ? 'gray' : color]}`}
`

// eslint-disable-next-line
export const Button = React.forwardRef<any, PropsWithChildren<ButtonProps>>(
  ({ children, isLoading, ...props }, ref) => (
    <ButtonCore ref={ref} {...props}>
      {isLoading ? (
        <Loading />
      ) : typeof children === 'string' ? (
        <Text
          color="none"
          className="ease-out"
          variant={textSizeVariants[props.size || 'base']}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </ButtonCore>
  )
)
