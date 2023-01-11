import React from 'react'
import tw from 'tailwind-styled-components'

export const InputCore = tw.input<InputCoreProps>`
px-2 border placeholder:text-gray-500 border-gray-500 transition text-slate-200 bg-gray-900 rounded-md outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent
${({ $big }) => $big && 'text-2xl text-center'}
`

type InputCoreProps = { $big?: boolean }

export type InputProps = {
  big: boolean
} & React.InputHTMLAttributes<HTMLInputElement>

// eslint-disable-next-line
export const Input = React.forwardRef<
  any,
  InputProps & {
    icon?: React.ReactNode
  }
>(({ icon, big, ...props }, ref) => {
  return (
    <div className="relative group">
      <InputCore type="text" $big={big} ref={ref} {...props} />
      {icon}
    </div>
  )
})
