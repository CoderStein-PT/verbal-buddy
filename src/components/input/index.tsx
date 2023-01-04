import React from 'react'
import tw from 'tailwind-styled-components'

export const InputCore = tw.input`px-2 border border-gray-400 text-white bg-gray-900 rounded-md`

// eslint-disable-next-line
export const Input = React.forwardRef(({ className = '', ...props }, ref) => {
  return <InputCore type="text" ref={ref} className={className} {...props} />
})
