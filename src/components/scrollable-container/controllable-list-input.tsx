import { Input, InputProps, Text } from 'ui'
import React from 'react'
import { ControllableListType } from './use-controllable-list'

// eslint-disable-next-line react/display-name
export const ControllableListInput = React.forwardRef<
  any,
  InputProps & {
    icon?: React.ReactNode
  } & {
    controllableList: ControllableListType
    selectedItemText?: string
  }
>(
  (
    { controllableList, selectedItemText, onBlur, onKeyDown, ...props },
    ref
  ) => {
    const onRealBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      controllableList.setSelectedIdx(null)
      onBlur?.(e)
    }

    const onRealKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (controllableList.onKeyDown(e)) return
      onKeyDown?.(e)
    }

    return (
      <div className="relative w-full">
        <div
          className={controllableList.selectedIdx !== null ? ' opacity-0' : ''}
        >
          <Input
            ref={ref}
            onKeyDown={onRealKeyDown}
            onBlur={onRealBlur}
            {...props}
          />
          <div className="pt-2">
            <Text variant="subtitle" color="gray-light">
              {'Use arrow (↑↓) keys to navigate'}
            </Text>
          </div>
        </div>
        {controllableList.selectedIdx !== null && (
          <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full text-center">
            <div>
              <Text variant="button">{selectedItemText}</Text>
              <Text color="gray-light">{'Press Enter to open'}</Text>
            </div>
          </div>
        )}
      </div>
    )
  }
)
