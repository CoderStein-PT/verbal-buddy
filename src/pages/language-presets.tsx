import { Text, Button, Select, Label, OptionType } from 'ui'
import { languagePresets } from 'presets'
import { useState } from 'react'

export const LanguagePresets = () => {
  const [native, setNative] = useState(null)
  const [desired, setDesired] = useState(null)

  const languagePresetsOptions = languagePresets.map((preset) => ({
    value: preset.name,
    name: preset.name
  }))

  const onChangeNative = (option: OptionType) => {
    setNative(option.value)
  }

  const onChangeDesired = (option: OptionType) => {
    setDesired(option.value)
  }

  return (
    <div className="relative flex flex-col">
      <Text variant="button">{'Language Presets'}</Text>
      <Text className="mt-2" variant="subtitle" color="gray-light">
        {
          'Here you can quickly create a custom preset based on a language you want to learn.'
        }
      </Text>
      <div className="flex items-end justify-between mt-4 space-x-2">
        <div className="flex items-center space-x-4">
          <div>
            <Label>{'Native'}</Label>
            <Select
              options={languagePresetsOptions}
              value={native}
              placeholder="Language"
              onChange={onChangeNative}
            />
          </div>
          <div>
            <Label>{'Desired'}</Label>
            <Select
              options={languagePresetsOptions}
              value={desired}
              placeholder="Language"
              onChange={onChangeDesired}
            />
          </div>
        </div>
        <Button size="md" color="grayPrimary">
          {'Apply'}
        </Button>
      </div>
    </div>
  )
}
