import { VoiceInputType } from 'components/scrollable-container/use-voice-input'
import React, { useEffect } from 'react'
import tw from 'tailwind-styled-components'

export const InputCore = tw.input<InputCoreProps>`
px-2 tracking-wide border placeholder:text-gray-500 border-gray-500 transition text-slate-200 bg-gray-900 rounded-md outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent w-full
${({ $big }) => $big && 'text-2xl text-center'}
`

type InputCoreProps = { $big?: boolean }

export type InputProps = {
  big?: boolean
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

export const InputWithVoiceCore = (
  {
    voiceInput,
    onBlur,
    onFocus,
    ...props
  }: {
    voiceInput?: VoiceInputType
    icon?: React.ReactNode
  } & InputProps,
  ref: React.Ref<HTMLInputElement>
) => {
  const onRealBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlur?.(e)
    voiceInput?.onBlur?.()
  }

  const onRealFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    onFocus?.(e)
    voiceInput?.onFocus?.()
  }

  useEffect(() => {
    if (!props.autoFocus) return
    onFocus?.(null as any)
  }, [props.autoFocus, onFocus])

  return (
    <Input
      {...props}
      className="pr-24 pl-8"
      ref={ref}
      onFocus={onRealFocus}
      onBlur={onRealBlur}
    />
  )
}

export const InputWithVoice = React.forwardRef<
  any,
  InputProps & {
    voiceInput?: VoiceInputType
    icon?: React.ReactNode
  }
>(InputWithVoiceCore)
