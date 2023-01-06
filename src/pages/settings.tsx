import { Text, Button, Input, Label, SeparatorSm } from 'components'
import { presets } from 'presets'
import { PresetType } from 'presets/types'
import { useStore } from 'store'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { findLastId } from 'utils'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'

const Preset = ({
  preset,
  custom
}: {
  preset: PresetType
  custom?: boolean
}) => {
  const [applied, setApplied] = useState(false)

  const applyPreset = () => {
    useStore.setState((state) => ({
      ...state,
      ...preset.data,
      practiceStats: [],
      selectedWords: []
    }))
    toast.success('Preset applied!')
    setApplied(true)
    setTimeout(() => setApplied(false), 3000)
  }

  const deletePreset = () => {
    useStore.setState((state) => ({
      settings: {
        ...state.settings,
        myPresets: state.settings.myPresets?.filter((p) => p.id !== preset.id)
      }
    }))
  }

  return (
    <div className="flex justify-between px-2 pt-2 space-x-2">
      <div>
        <Text>{preset.name}</Text>
        <Text variant="subtitle">{preset.description}</Text>
      </div>
      <div className="flex flex-col justify-end">
        <div className="flex items-center justify-center space-x-2">
          <Button
            size="sm"
            key={preset.name}
            disabled={applied}
            onClick={applyPreset}
          >
            {applied ? 'Applied' : 'Apply'}
          </Button>
          <div>
            {custom && (
              <Button size="icon" color="red" onClick={deletePreset}>
                <RiCloseFill />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const Presets = () => {
  const myPresets = useStore((state) => state.settings.myPresets) || []

  const saveCurrentStateAsPreset = () => {
    //get current state from store, but only the parts that are relevant for presets
    const currentState = useStore.getState()

    const data = {
      categories: currentState.categories,
      words: currentState.words
    }

    const id = findLastId([...presets, ...myPresets]) + 1

    const name = prompt('Enter preset name') || 'Preset ' + id
    const description = prompt('Enter preset description') || 'My Custom Preset'

    useStore.setState((state) => ({
      settings: {
        ...state.settings,
        myPresets: [
          ...(state.settings.myPresets || []),
          { id, name, description, data }
        ]
      }
    }))
  }

  return (
    <div>
      <div className="flex flex-col space-y-2 divide-y divide-gray-500 divide-dashed">
        {presets.map((preset) => (
          <Preset preset={preset} key={preset.name} />
        ))}
        {myPresets?.map((preset) => (
          <Preset preset={preset} key={preset.name} custom />
        ))}
      </div>
      <div className="flex flex-col mt-4">
        <Button onClick={saveCurrentStateAsPreset}>
          {'Save current state'}
        </Button>
      </div>
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

  const onChangePracticeDelayTolerance = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    useStore.setState((state) => ({
      settings: { ...state.settings, practiceDelayTolerance: +e.target.value }
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
      <div className="flex flex-col">
        <Label>
          {
            'Practice delay tolerance (stop the timer when you type for this amount of seconds)'
          }
        </Label>
        <Input
          min={0}
          max={10}
          step={0.1}
          type="number"
          value={settings.practiceDelayTolerance || 1}
          onChange={onChangePracticeDelayTolerance}
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
