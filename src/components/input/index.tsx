import React from 'react'
import tw from 'tailwind-styled-components'

export const InputCore = tw.input`px-2 border border-gray-500 text-slate-200 bg-gray-900 rounded-md outline-none`

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

// eslint-disable-next-line
export const Input = React.forwardRef<any, InputProps>(({ ...props }, ref) => {
  return <InputCore type="text" ref={ref} {...props} />
})
