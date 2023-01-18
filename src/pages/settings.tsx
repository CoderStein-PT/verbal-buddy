import {
  Select,
  Text,
  Input,
  Label,
  SeparatorFull,
  Switch,
  OptionType
} from 'ui'
import { PageContainer } from 'components'
import { useStore } from 'store'
import { getCurrentVoice, pronounce } from 'utils'
import { FaQuestionCircle } from '@react-icons/all-files/fa/FaQuestionCircle'
import { TooltipWrapper } from 'react-tooltip'
import { useVoiceStore } from 'voice-store'
import { Presets } from './presets'
import { LanguagePresets } from './language-presets'

export const explanations = {
  jokes: {
    randomWords:
      'Number of random words to select from the list to create random jokes.'
  },
  pronunciation: {
    voice: 'Voice to use for pronunciation.'
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

export const Explanation = ({ title }: { title: string }) => (
  <div className="absolute top-0 right-0 cursor-pointer">
    <TooltipWrapper content={title} place="right">
      <FaQuestionCircle className="text-gray-400" />
    </TooltipWrapper>
  </div>
)

export const SettingsPage = () => {
  const settings = useStore((state) => state.settings)
  const voices = useVoiceStore((state) => state.voices)

  const currentVoice = getCurrentVoice()

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

  const onChangeVoice = (option: OptionType) => {
    useStore.setState((state) => ({
      settings: { ...state.settings, voice: option.value }
    }))
    pronounce('Hello, this is your new voice')
  }

  return (
    <PageContainer>
      <div className="px-2 space-y-4">
        <Presets />
        <SeparatorFull />
        <LanguagePresets />
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
        <Text variant="button">{'Pronunciation'}</Text>
        <div className="relative flex flex-col">
          <Label>{'Voice'}</Label>
          {voices ? (
            <Select
              options={voices.map((voice) => ({
                name:
                  voice.voiceURI +
                  ' (' +
                  voice.lang +
                  ')' +
                  (voice.default ? ' (default)' : ''),
                value: voice.voiceURI
              }))}
              value={currentVoice?.voiceURI || '...'}
              onChange={onChangeVoice}
            />
          ) : (
            <Text color="gray-light">{'Loading voices...'}</Text>
          )}
          <Explanation title={explanations.pronunciation.voice} />
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
        <SeparatorFull />
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
      </div>
    </PageContainer>
  )
}
