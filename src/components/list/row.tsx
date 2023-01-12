import { Input, Button, Text, ButtonProps, TextProps } from 'components'
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

export type ActionType = {
  title?: string
  onClick?: 'edit' | (() => void)
  icon: React.FunctionComponent
  color?: ButtonProps['color']
}

export const Row = ({
  text,
  onClick,
  onChange,
  index,
  actions,
  ellipsis = true,
  isSelected,
  color = undefined
}: {
  text?: React.ReactNode | string
  onClick?: () => void
  onChange?: (text: string | undefined) => void
  index?: number
  actions?: ActionType[]
  ellipsis?: boolean
  isSelected?: boolean
  color?: TextProps['color']
}) => {
  const [isEditMode, setIsEditMode] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode)
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    }, 0)
  }

  const onChangeReal = () => {
    setIsEditMode(false)
    onChange?.(inputRef?.current?.value)
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    onChangeReal()
  }

  return (
    <div className="flex items-center justify-between space-x-1 group">
      <div
        className={
          'w-full cursor-pointer group' + (isEditMode ? '' : ' overflow-hidden')
        }
        onClick={onClick}
      >
        {isEditMode ? (
          <div className="p-0.5">
            <Input
              className="w-full"
              ref={inputRef}
              onBlur={onChangeReal}
              defaultValue={typeof text === 'string' ? text : ''}
              onKeyDown={onKeyDown}
            />
          </div>
        ) : (
          <TooltipWrapper
            content={
              typeof text === 'string' && text.length > 20 ? text : undefined
            }
          >
            <Text
              className={`${isSelected ? '' : 'group-hover:text-primary-500'} ${
                ellipsis
                  ? 'text-ellipsis overflow-hidden whitespace-nowrap'
                  : ''
              }`}
              color={isSelected ? 'gray-light' : color}
            >
              {text}
            </Text>
          </TooltipWrapper>
        )}
      </div>
      <div className="flex items-center space-x-1 transition duration-300 md:opacity-0 group-hover:opacity-100 group-hover:duration-150">
        {actions?.map((action, index) => (
          <ActionButton
            key={index}
            toggleEditMode={toggleEditMode}
            action={action}
          />
        ))}
      </div>
      <div className="w-8 ml-2 text-right">
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
    </div>
  )
}
