import { Input, Button, Text, ButtonProps, TextProps } from 'ui'
import React, { useCallback } from 'react'
import { useState, useRef } from 'react'
import { TooltipWrapper } from 'react-tooltip'

const ActionButton = ({
  action,
  toggleEditMode
}: {
  action: ActionType
  toggleEditMode: () => void
}) => {
  const onClick = () => {
    if (!action.onClick) return

    action.onClick === 'edit' ? toggleEditMode() : action.onClick()
  }

  return (
    <div>
      <Button onClick={onClick} size="icon" color={action.color}>
        <action.icon />
      </Button>
    </div>
  )
}

const Actions = ({
  actions,
  actionsVisible,
  toggleEditMode
}: {
  actions?: ActionType[]
  actionsVisible?: boolean
  toggleEditMode: () => void
}) => (
  <div className="flex items-center space-x-1">
    {actions?.map((action) => (
      <div
        key={action.title}
        className={`${
          actionsVisible || action.alwaysShow
            ? ''
            : 'transition duration-200 md:opacity-0 group-hover:opacity-100 group-hover:duration-75'
        }`}
      >
        <TooltipWrapper content={action.title}>
          <ActionButton toggleEditMode={toggleEditMode} action={action} />
        </TooltipWrapper>
      </div>
    ))}
  </div>
)

const useEditableRow = ({
  onChange
}: {
  onChange?: (text: string | undefined) => void
}) => {
  const [isEditMode, setIsEditMode] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const toggleEditMode = useCallback(() => {
    setIsEditMode(!isEditMode)
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    }, 0)
  }, [isEditMode])

  const onChangeReal = useCallback(() => {
    setIsEditMode(false)
    onChange?.(inputRef?.current?.value)
  }, [onChange])

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return
      onChangeReal()
    },
    [onChangeReal]
  )

  return { isEditMode, toggleEditMode, inputRef, onChangeReal, onKeyDown }
}

export const EditableRowText = ({
  editableRow,
  onClick,
  text,
  ellipsis = true,
  isSelected,
  color = undefined,
  selectedColor = 'primary'
}: {
  editableRow: ReturnType<typeof useEditableRow>
  onClick?: () => void
  text: string | React.ReactNode
  ellipsis?: boolean
  isSelected?: boolean
  color?: TextProps['color']
  selectedColor?: TextProps['color']
}) => {
  return (
    <div
      className={
        'w-full cursor-pointer group' +
        (editableRow.isEditMode ? '' : ' overflow-hidden')
      }
      onClick={onClick}
    >
      {editableRow.isEditMode ? (
        <div className="p-0.5">
          <Input
            className="w-full"
            ref={editableRow.inputRef}
            onBlur={editableRow.onChangeReal}
            defaultValue={typeof text === 'string' ? text : ''}
            onKeyDown={editableRow.onKeyDown}
          />
        </div>
      ) : (
        <TooltipWrapper
          content={
            typeof text === 'string' && text.length > 20 ? text : undefined
          }
        >
          <Text
            className={`${
              isSelected
                ? ''
                : 'group-hover:text-primary-600 group-active:text-primary-500 group-hover:transition-none'
            } ${
              ellipsis ? 'text-ellipsis overflow-hidden whitespace-nowrap' : ''
            }`}
            color={isSelected ? selectedColor : color}
            style={{
              transitionDuration: isSelected ? '0s' : undefined
            }}
          >
            {text}
          </Text>
        </TooltipWrapper>
      )}
    </div>
  )
}

const Infos = ({ info }: { info?: InfoType[] }) => {
  return (
    <div className="flex items-stretch cursor-pointer">
      {info?.map((info) => (
        <div className="flex items-center" key={info.title}>
          <TooltipWrapper
            content={info.title}
            className="flex items-center h-full"
          >
            <div className={info.class}>
              <info.icon />
            </div>
          </TooltipWrapper>
        </div>
      ))}
    </div>
  )
}

export type ActionType = {
  title?: string
  onClick?: 'edit' | (() => void)
  icon: React.FunctionComponent
  color?: ButtonProps['color']
  alwaysShow?: boolean
}

export type InfoType = {
  title?: string
  icon: React.FunctionComponent
  class?: string
}

const IdRow = ({ index }: { index?: number }) => {
  return (
    <div className="flex flex-col justify-center flex-shrink-0 w-5 mr-2 text-left">
      {index !== undefined && (
        <Text
          className="group-hover:text-primary-500"
          variant="subtitle"
          color="gray-light"
        >
          {index}
        </Text>
      )}
    </div>
  )
}

export type RowProps = {
  text?: React.ReactNode | string
  onClick?: () => void
  onChange?: (text: string | undefined) => void
  index?: number
  actions?: ActionType[]
  ellipsis?: boolean
  isSelected?: boolean
  color?: TextProps['color']
  actionsVisible?: boolean
  selectedColor?: TextProps['color']
  info?: InfoType[]
}

// eslint-disable-next-line react/display-name
export const Row = ({
  text,
  onClick,
  onChange,
  index,
  actions,
  ellipsis = true,
  isSelected,
  color = undefined,
  actionsVisible,
  selectedColor = 'gray-light',
  info
}: RowProps) => {
  const editableRow = useEditableRow({ onChange })

  return (
    <div className="flex items-stretch justify-between space-x-1 group">
      <IdRow index={index} />
      <EditableRowText
        text={text}
        editableRow={editableRow}
        onClick={onClick}
        ellipsis={ellipsis}
        isSelected={isSelected}
        color={color}
        selectedColor={selectedColor}
      />
      <Actions
        actions={actions}
        actionsVisible={actionsVisible}
        toggleEditMode={editableRow.toggleEditMode}
      />
      <Infos info={info} />
    </div>
  )
}
