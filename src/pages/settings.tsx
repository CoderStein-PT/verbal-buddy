import { Text, Button, Input, Label, SeparatorSm } from 'components'
import { presets } from 'presets'
import { PresetType } from 'presets/types'
import { useStore } from 'store'
import { toast } from 'react-toastify'
import { useState } from 'react'

const Preset = ({ preset }: { preset: PresetType }) => {
  const [applied, setApplied] = useState(false)

  const applyPreset = () => {
    useStore.setState((state) => ({ ...state, ...preset.data }))
    toast.success('Preset applied!')
    setApplied(true)
    setTimeout(() => setApplied(false), 3000)
  }

  return (
    <div className="flex justify-between px-2 pt-2 space-x-2">
      <div>
        <Text>{preset.name}</Text>
        <Text variant="subtitle">{preset.description}</Text>
      </div>
      <div className="flex flex-col justify-end">
        <Button
          size="sm"
          key={preset.name}
          disabled={applied}
          onClick={applyPreset}
        >
          {applied ? 'Applied' : 'Apply'}
        </Button>
      </div>
    </div>
  )
}

const Presets = () => {
  return (
    <div className="flex flex-col space-y-2 divide-y divide-gray-500 divide-dashed">
      {presets.map((preset) => (
        <Preset preset={preset} key={preset.name} />
      ))}
    </div>
  )
}

export const SettingsPage = () => {
  const settings = useStore((state) => state.settings)

  const onChangePracticeMaxWords = (e: React.ChangeEvent<HTMLInputElement>) => {
    useStore.setState((state) => ({
      settings: { ...state.settings, practiceMaxWords: +e.target.value }
    }))
  }

  const onChangeRandomWords = (e: React.ChangeEvent<HTMLInputElement>) => {
    useStore.setState((state) => ({
      settings: { ...state.settings, randomWords: +e.target.value }
    }))
  }

  return (
    <div className="w-[400px] mx-auto space-y-4">
      <div className="flex flex-col">
        <Label>{'Practice max words'}</Label>
        <Input
          min={10}
          max={10000}
          type="number"
          value={settings.practiceMaxWords}
          onChange={onChangePracticeMaxWords}
        />
      </div>
      <div className="flex flex-col">
        <Label>{'Random words selector'}</Label>
        <Input
          min={1}
          max={10}
          type="number"
          value={settings.randomWords}
          onChange={onChangeRandomWords}
        />
      </div>
      <SeparatorSm />
      <div>
        <Text variant="button">{'Presets'}</Text>
        <Presets />
      </div>
    </div>
  )
}
