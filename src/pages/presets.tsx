import { Text, Button } from 'ui'
import { presets } from 'presets'
import { PresetType } from 'presets/types'
import { useStore } from 'store'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { findLastId } from 'utils'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'
import { Explanation, explanations } from './settings'

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
      guessStats: [],
      selectedWords: [],
      jokes: []
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
            color="grayPrimary"
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

export const Presets = () => {
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
    <div className="relative flex flex-col">
      <Text id="presets" variant="button">
        {'Presets'}
      </Text>
      <Explanation title={explanations.presets.main} />
      <div className="flex flex-col w-full space-y-2 divide-y divide-gray-500 divide-dashed">
        {presets.map((preset) => (
          <Preset preset={preset} key={preset.name} />
        ))}
        {myPresets?.map((preset) => (
          <Preset preset={preset} key={preset.name} custom />
        ))}
      </div>
      <div className="flex flex-col mt-4 space-y-2">
        <Button onClick={saveCurrentStateAsPreset}>
          {'Save Current State'}
        </Button>
      </div>
    </div>
  )
}
