import { Input, Button, Text, ButtonProps } from 'components'
import { useState, useRef } from 'react'

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

type ActionType = {
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
  ellipsis,
  isSelected
}: {
  text?: string
  onClick?: () => void
  onChange?: (text: string | undefined) => void
  index?: number
  actions?: ActionType[]
  ellipsis?: boolean
  isSelected?: boolean
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
        className="w-full overflow-hidden cursor-pointer group"
        onClick={onClick}
      >
        {isEditMode ? (
          <Input
            className="w-full"
            ref={inputRef}
            onBlur={onChangeReal}
            defaultValue={text}
            onKeyDown={onKeyDown}
          />
        ) : (
          <Text
            title={text}
            className={`${isSelected ? '' : 'group-hover:text-green-500'} ${
              ellipsis ? 'text-ellipsis overflow-hidden whitespace-nowrap' : ''
            }`}
            color={isSelected ? 'gray-light' : undefined}
          >
            {text}
          </Text>
        )}
      </div>
      <div className="flex items-center space-x-1 transition opacity-0 duration-500-150 group-hover:opacity-100 hover:duration-150">
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
            className="group-hover:text-green-500"
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
