import React, { useMemo, useState } from 'react'
import { InputCore, Text, Card } from 'ui'
import tw from 'tailwind-styled-components'
import { Listbox, Portal } from '@headlessui/react'
import { usePopper } from 'react-popper'
import { GoChevronDown } from '@react-icons/all-files/go/GoChevronDown'

export type OptionType = {
  name: string
  value: any
}

export type SelectType = {
  options: OptionType[]
  onChange?: any
  value: string | null
  placeholder?: string
}

export const OptionBase = tw.div`transition ease-out relative py-1 px-3`

export const OptionContainer = ({ children, ...props }) => (
  <OptionBase className="cursor-pointer group" {...props}>
    <Text variant="subtitle">{children}</Text>
  </OptionBase>
)

const useSelectPopper = () => {
  const [button, setButton] = useState<HTMLButtonElement | null>(null)
  const [popper, setPopper] = useState<HTMLUListElement | null>(null)

  const { styles, attributes } = usePopper(button, popper, {
    placement: 'bottom',
    strategy: 'fixed',
    modifiers: [
      { name: 'offset', options: { offset: [0, 10] } }
      // {
      //   name: "sameWidth",
      //   enabled: true,
      //   phase: "beforeWrite",
      //   requires: ["computeStyles"],
      //   fn: ({ state }) => {
      //     state.styles.popper.width = `${state.rects.reference.width}px`
      //   },
      //   effect: ({ state }) => {
      //     state.elements.popper.style.width = `${state.elements.reference.offsetWidth}px`
      //   },
      // },
    ]
  })

  return useMemo(
    () => ({
      button,
      setButton,
      popper,
      setPopper,
      styles,
      attributes
    }),
    [button, setButton, popper, setPopper, styles, attributes]
  )
}

export const Select = ({
  options,
  onChange,
  value,
  placeholder
}: SelectType) => {
  const selectedOption = options.find((option) => option.value === value)
  const { setButton, button, setPopper, styles, attributes } = useSelectPopper()

  return (
    <div className="relative">
      <Listbox value={selectedOption} onChange={onChange}>
        <Listbox.Button as={React.Fragment} ref={setButton}>
          <InputCore
            className="relative flex items-center justify-between w-full truncate cursor-pointer"
            $as="button"
          >
            {selectedOption?.name || placeholder}
            <span className="-mr-1">
              <GoChevronDown className="w-5 h-5" />
            </span>
          </InputCore>
        </Listbox.Button>
        <Portal>
          <Listbox.Options
            ref={setPopper}
            className="z-20 outline-none"
            style={styles.popper}
            {...attributes.popper}
          >
            <Card style={{ minWidth: button?.offsetWidth }}>
              <div className="overflow-y-auto max-h-[200px]">
                {options.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    value={option}
                    as={React.Fragment}
                  >
                    {({ active, selected }) => (
                      <OptionBase
                        className={`cursor-pointer ${
                          active ? 'bg-primary-100 dark:bg-slate-900' : ''
                        }`}
                      >
                        <Text
                          color={selected || active ? 'primary' : undefined}
                        >
                          {option.name}
                        </Text>
                      </OptionBase>
                    )}
                  </Listbox.Option>
                ))}
              </div>
            </Card>
          </Listbox.Options>
        </Portal>
      </Listbox>
    </div>
  )
}
