import React from 'react'

// eslint-disable-next-line
export const Input = React.forwardRef(({ className = '', ...props }, ref) => {
  return (
    <input
      type="text"
      ref={ref}
      className={
        'px-2 border border-gray-400 text-white bg-gray-900 rounded-md ' +
        className
      }
      {...props}
    />
  )
})
