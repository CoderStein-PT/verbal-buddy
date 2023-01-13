import {
  Text,
  Button,
  Input,
  Label,
  SeparatorFull,
  Switch,
  ScrollableContainer
} from 'components'
import { presets } from 'presets'
import { PresetType } from 'presets/types'
import { useStore } from 'store'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { findLastId } from 'utils'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'
import { FaQuestionCircle } from '@react-icons/all-files/fa/FaQuestionCircle'
import { TooltipWrapper } from 'react-tooltip'

const explanations = {
  jokes: {
    randomWords:
      'Number of random words to select from the list to create random jokes.'
  },
  guess: {
    maxWords:
      "Maximum number of words to play in Guess Games. Avoid practicing too many words at once if you're not ready."
  },
  practice: {
    maxWords:
      "Maximum number of words to practice. Avoid practicing too many words at once if you're not ready.",
    delayTolerance:
      'Stops the timer when you type for this amount of seconds so stats are not affected by typing pauses',
    startRightAway:
      'Starts the timer right away when you start a practice session if ON',
    countdown: 'Gives you a bit of time to prepare (in seconds)'
  },
  presets: {
    main: 'Presets are a set of words and categories that you can apply to your current session. Resets all your stats.'
  }
}

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

const Explanation = ({ title }: { title: string }) => (
  <div className="absolute top-0 right-0 cursor-pointer">
    <TooltipWrapper content={title} place="right">
      <FaQuestionCircle className="text-gray-400" />
    </TooltipWrapper>
  </div>
)

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
      <div className="flex flex-col w-full space-y-2 divide-y divide-gray-500 divide-dashed">
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

  const onChangePracticeCountdown = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    useStore.setState((state) => ({
      settings: { ...state.settings, practiceCountdown: +e.target.value }
    }))
  }

  const onChangeStartRightAway = (checked: boolean) => {
    useStore.setState((state) => ({
      settings: { ...state.settings, practiceStartRightAway: checked }
    }))
  }

  const onChangeGuessMaxWords = (e: React.ChangeEvent<HTMLInputElement>) => {
    useStore.setState((state) => ({
      settings: { ...state.settings, guessMaxWords: +e.target.value }
    }))
  }

  return (
    <div className="justify-between block md:space-x-12 md:flex">
      <div className="md:w-[480px] w-full">
        <ScrollableContainer maxHeight={600}>
          <div className="space-y-4">
            <Text variant="button">{'Jokes'}</Text>
            <div className="relative flex flex-col">
              <Label>{'Random words selector'}</Label>
              <Input
                min={1}
                max={10}
                type="number"
                value={settings.randomWords}
                onChange={onChangeRandomWords}
              />
              <Explanation title={explanations.jokes.randomWords} />
            </div>
            <SeparatorFull />
            <Text variant="button">{'Guess Games'}</Text>
            <div className="relative flex flex-col">
              <Label>{'Guess max words'}</Label>
              <Input
                min={10}
                max={10000}
                type="number"
                value={settings.guessMaxWords}
                onChange={onChangeGuessMaxWords}
              />
              <Explanation title={explanations.guess.maxWords} />
            </div>
            <SeparatorFull />
            <Text variant="button">{'Practice'}</Text>
            <div className="relative flex flex-col">
              <Label>{'Practice max words'}</Label>
              <Input
                min={10}
                max={10000}
                type="number"
                value={settings.practiceMaxWords}
                onChange={onChangePracticeMaxWords}
              />
              <Explanation title={explanations.practice.maxWords} />
            </div>
            <div className="relative flex flex-col">
              <Label>{'Practice delay tolerance'}</Label>
              <Input
                min={0}
                max={10}
                step={0.1}
                type="number"
                value={settings.practiceDelayTolerance || 1}
                onChange={onChangePracticeDelayTolerance}
              />
              <Explanation title={explanations.practice.delayTolerance} />
            </div>
            <div className="relative flex flex-col">
              <Label>{'Start the timer right away'}</Label>
              <Switch
                checked={settings.practiceStartRightAway}
                onChange={onChangeStartRightAway}
              />
              <Explanation title={explanations.practice.startRightAway} />
            </div>
            <div className="relative flex flex-col">
              <Label>{'Practice countdown'}</Label>
              <Input
                min={0}
                max={10}
                step={0.1}
                type="number"
                value={settings.practiceCountdown || 3}
                onChange={onChangePracticeCountdown}
              />
              <Explanation title={explanations.practice.countdown} />
            </div>
          </div>
        </ScrollableContainer>
      </div>
      <div className="relative mt-8 md:w-1/2 md:mt-0">
        <Text id="presets" variant="button">
          {'Presets'}
        </Text>
        <Explanation title={explanations.presets.main} />
        <Presets />
      </div>
    </div>
  )
}
