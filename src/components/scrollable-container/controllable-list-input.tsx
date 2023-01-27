import { InputProps, InputWithVoice, Text } from 'ui'
import React from 'react'
import { ControllableListType } from './use-controllable-list'
import { HelpIcon } from './commander-help'
import { VoiceInputType } from './use-voice-input'

export type ControllableListInputType = InputProps & {
  voiceInput?: VoiceInputType
  icon?: React.ReactNode
} & {
  controllableList: ControllableListType
  selectedItemText?: string
}

export const ControllableListInputCore = (
  {
    controllableList,
    selectedItemText,
    onBlur,
    onKeyDown,
    onKeyUp,
    onFocus,
    voiceInput,
    ...props
  }: ControllableListInputType,
  ref: React.Ref<HTMLInputElement>
) => {
  const onRealBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    controllableList.setSelectedIdx(null)
    onBlur?.(e)
  }

  const onRealFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    onFocus?.(e)
  }

  const onRealKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (controllableList.onKeyDown(e)) return
    onKeyDown?.(e)
  }

  const onRealKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (controllableList.onKeyUp()) return
    onKeyUp?.(e)
  }

  return (
    <div className="relative w-full">
      <div
        className={controllableList.selectedIdx !== null ? ' opacity-0' : ''}
      >
        <HelpIcon title="Commander Help" />
        <InputWithVoice
          ref={ref}
          onKeyDown={onRealKeyDown}
          onBlur={onRealBlur}
          onFocus={onRealFocus}
          onKeyUp={onRealKeyUp}
          voiceInput={voiceInput}
          {...props}
        />
      </div>
      {controllableList.selectedIdx !== null && (
        <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full text-center">
          <div>
            <Text variant="button">
              {selectedItemText && selectedItemText?.length > 30
                ? selectedItemText.slice(0, 30) + '...'
                : selectedItemText}
            </Text>
            <Text
              color="gray-light"
              variant="subtitle"
              dangerouslySetInnerHTML={{
                __html:
                  '<span class="key-span" >Enter</span> to open, <span class="key-span" >Del</span> to remove, <span class="key-span" >Ctrl + S</span> to pronounce.'
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export const ControllableListInput = React.forwardRef<
  any,
  InputProps & {
    icon?: React.ReactNode
    voiceInput?: VoiceInputType
  } & {
    controllableList: ControllableListType
    selectedItemText?: string
  }
>(ControllableListInputCore)
