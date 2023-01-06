import React, { PropsWithChildren } from 'react'
import tw from 'tailwind-styled-components'
import { Loading, Text, TextProps } from 'components'

const sizeClasses = {
  round: 'p-2 rounded-full',
  sm: 'py-1 px-3 rounded-lg',
  base: 'py-2 px-6 rounded-xl',
  lg: 'py-3 px-6 rounded-2xl',
  xl: 'py-4 px-8 text-lg rounded-2xl',
  icon: 'p-0.5 rounded-full'
}

const textSizeVariants: Record<string, TextProps['variant']> = {
  sm: 'subtitle',
  base: 'button',
  lg: 'button',
  xl: 'button',
  round: 'button',
  icon: 'subtitle'
}

const colorClasses = {
  primary:
    'text-white bg-primary-500 border border-transparent hover:bg-primary-400 dark:bg-transparent dark:text-primary-500 dark:border-primary-500 dark:hover:bg-primary-500 dark:hover:text-white dark:hover:shadow-primary-light',
  gray: 'text-gray-800 bg-gray-100 border border-gray-300 hover:bg-gray-200 dark:bg-transparent dark:text-white dark:border-gray-500 dark:hover:bg-gray-500 dark:hover:text-white',
  red: 'text-gray-800 bg-red-100 border border-red-300 hover:bg-red-200 dark:bg-transparent dark:text-red-500 dark:border-red-500 dark:hover:bg-red-500 dark:hover:text-white dark:hover:shadow-red-light'
}

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: keyof typeof sizeClasses
  color?: keyof typeof colorClasses
  disabled?: boolean
  isLoading?: boolean
}

export const ButtonCore = tw.button<ButtonProps>`
  relative flex items-center justify-center transition ease-out appearance-none font-title whitespace-nowrap
  ${({ size = 'base', color = 'primary', disabled }) =>
    `${sizeClasses[size]} ${colorClasses[disabled ? 'gray' : color]}`}
`

// eslint-disable-next-line
export const Button = React.forwardRef<any, PropsWithChildren<ButtonProps>>(
  ({ children, isLoading, ...props }, ref) => (
    <ButtonCore ref={ref} {...props}>
      {isLoading ? (
        <Loading />
      ) : (
        <Text
          color="none"
          className="ease-out"
          variant={props.size ? textSizeVariants[props.size] : undefined}
        >
          {children}
        </Text>
      )}
    </ButtonCore>
  )
)
