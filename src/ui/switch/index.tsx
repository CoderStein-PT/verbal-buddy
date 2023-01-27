import { Switch as SwitchBase } from '@headlessui/react'

export const Switch = ({
  checked,
  onChange,
  title,
  ...props
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  title?: string
}) => (
  <SwitchBase
    checked={checked}
    onChange={onChange}
    className={`${
      checked
        ? 'border-primary-500 bg-primary-900'
        : 'bg-gray-800 border-gray-600'
    } relative inline-flex items-center h-6 rounded-full w-11 transition border`}
    {...props}
  >
    <span className="sr-only">{title}</span>
    <span
      className={`${
        checked
          ? 'translate-x-6 bg-primary-500 shadow-primary-light '
          : 'translate-x-1 bg-gray-100'
      } inline-block w-4 h-4 transform rounded-full transition ease-out duration-200`}
    />
  </SwitchBase>
)
