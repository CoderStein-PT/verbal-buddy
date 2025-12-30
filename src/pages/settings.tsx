import {
  Select,
  Text,
  Input,
  Label,
  SeparatorFull,
  Switch,
  OptionType,
  inputModeHtml
} from 'ui'
import { PageContainer } from 'components'
import { useStore } from 'store'
import { getCurrentVoice, pronounce, recognitionLangs } from 'utils'
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
  voice: {
    pronunciation: 'Voice to use for pronunciation.',
    recognition: 'Language to use for speech recognition.',
    useSpeechRecognition:
      'Whether to use speech recognition. If you have a microphone, you can use it to practice/guess words faster.'
  },
  guess: {
    maxWords:
      "Maximum number of words to play in Guess Games. Avoid practicing too many words at once if you're not ready.",
    pronounceDefinitions: 'Pronounces definitions when new words are shown.'
  },
  practice: {
    maxWords:
      "Maximum number of words to practice. Avoid practicing too many words at once if you're not ready.",
    delayTolerance:
      'Stops the timer when you type for this amount of seconds so stats are not affected by typing pauses',
    startRightAway:
      'Starts the timer right away when you start a practice session if ON',
    countdown: 'Gives you a bit of time to prepare (in seconds)',
    voiceFeedback:
      'Whenever the word is entered correctly, the voice will say "correct" or "incorrect". When you guess all the words, the voice will say "finished"'
  },
  presets: {
    main: 'Presets are a set of words and categories that you can apply to your current session. Resets all your stats.'
  },
  ai: {
    token: 'Google AI API Token (Gemini). Required for AI features.',
    model: 'Google AI Model to use.'
  }
}

const googleAiModels = [
  { name: 'Gemini 3.0 Flash', value: 'gemini-3-flash-preview' },
  { name: 'Gemini 2.5 Flash', value: 'gemini-2.5-flash' },
]

export const Explanation = ({ title }: { title: string }) => (
  <div className="absolute top-0 right-0 cursor-pointer">
    <TooltipWrapper html={title} place="right">
      <FaQuestionCircle className="text-gray-400" />
    </TooltipWrapper>
  </div>
)

const voiceGreetingsByLanguage = {
  en: 'Hello, this is your new voice',
  es: 'Hola, esta es tu nueva voz',
  fr: 'Bonjour, ceci est votre nouvelle voix',
  de: 'Hallo, das ist deine neue Stimme',
  it: 'Ciao, questa è la tua nuova voce',
  pt: 'Olá, esta é a sua nova voz',
  ru: 'Привет, это ваш новый голос',
  ja: 'こんにちは、これはあなたの新しい声です',
  ko: '안녕하세요, 이것은 당신의 새로운 목소리입니다',
  zh: '你好，这是你的新声音',
  sk: 'Ahoj, to je tvoj nový hlas',
  pl: 'Cześć, to jest twój nowy głos',
  ro: 'Salut, acesta este noul tău glas',
  nl: 'Hallo, dit is je nieuwe stem',
  ar: 'مرحبا، هذه هي صوتك الجديد',
  el: 'Γεια σας, αυτή είναι η νέα φωνή σας',
  he: 'שלום, זה הקול החדש שלך',
  hi: 'नमस्ते, यह आपकी नई आवाज है',
  id: 'Halo, ini adalah suara baru Anda',
  cs: 'Ahoj, to je tvůj nový hlas',
  nb: 'Hei, dette er stemmen din'
}

export const SettingsPage = () => {
  const settings = useStore((state) => state.settings)
  const voices = useVoiceStore((state) => state.voices)
  const recognition = useVoiceStore((state) => state.recognition)
  const startRecognition = useVoiceStore((state) => state.startRecognition)
  const stopRecognition = useVoiceStore((state) => state.stopRecognition)

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

  const onChangePronounceDefinitions = (checked: boolean) => {
    useStore.setState((state) => ({
      settings: { ...state.settings, guessPronounceDefinitions: checked }
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
    const voiceCode = voices
      ?.find((v) => v.voiceURI === option.value)
      ?.lang.split('-')[0] as keyof typeof voiceGreetingsByLanguage | undefined
    pronounce(voiceGreetingsByLanguage[voiceCode || 'en'])
  }

  const onChangeSpeechRecognitionLang = (option: OptionType) => {
    if (recognition) {
      recognition.lang = option.value
      stopRecognition()
      setTimeout(() => {
        startRecognition()
      }, 1000)
    }
    useStore.setState((state) => ({
      settings: { ...state.settings, speechRecognitionLang: option.value }
    }))
  }

  const onChangeUseSpeechRecognition = (checked: boolean) => {
    useStore.setState((state) => ({
      settings: { ...state.settings, useSpeechRecognition: checked }
    }))
    if (checked) {
      recognition?.start()
    } else {
      recognition?.stop()
    }
  }

  const onChangeInputMode = (option: OptionType) => {
    useStore.setState((state) => ({
      settings: { ...state.settings, inputMode: option.value }
    }))
  }

  const onChangePracticeVoiceFeedback = (checked: boolean) => {
    useStore.setState((state) => ({
      settings: { ...state.settings, practiceVoiceFeedback: checked }
    }))
  }

  const onChangeGoogleAiToken = (e: React.ChangeEvent<HTMLInputElement>) => {
    useStore.setState((state) => ({
      settings: { ...state.settings, googleAiToken: e.target.value }
    }))
  }

  const onChangeGoogleAiModel = (option: OptionType) => {
    useStore.setState((state) => ({
      settings: { ...state.settings, googleAiModel: option.value }
    }))
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
        <div className="relative flex flex-col">
          <Label>{'Pronounce definitions'}</Label>
          <Switch
            checked={settings.guessPronounceDefinitions}
            onChange={onChangePronounceDefinitions}
          />
          <Explanation title={explanations.guess.pronounceDefinitions} />
        </div>
        <SeparatorFull />
        <Text variant="button">{'Voice'}</Text>
        <div className="relative flex flex-col">
          <Label>{'Pronunciation Voice'}</Label>
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
          <Explanation title={explanations.voice.pronunciation} />
        </div>
        <div className="relative flex flex-col">
          <Label>{'Use Speech Recognition'}</Label>
          <Switch
            checked={settings.useSpeechRecognition}
            onChange={onChangeUseSpeechRecognition}
          />
          <Explanation title={explanations.voice.useSpeechRecognition} />
        </div>
        <div className="relative flex flex-col">
          <Label>{'Recognition Voice'}</Label>
          <Select
            options={recognitionLangs.map((lang) => ({
              ...lang,
              value: lang.code
            }))}
            value={settings.speechRecognitionLang}
            onChange={onChangeSpeechRecognitionLang}
          />
          <Explanation title={explanations.voice.recognition} />
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
          <Label>{'Practice typing delay tolerance'}</Label>
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
          <Label>{'Voice feedback'}</Label>
          <Switch
            checked={settings.practiceVoiceFeedback}
            onChange={onChangePracticeVoiceFeedback}
          />
          <Explanation title={explanations.practice.voiceFeedback} />
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
        <SeparatorFull />
        <Text variant="button">{'AI'}</Text>
        <div className="relative flex flex-col">
          <Label>{'Google AI Token'}</Label>
          <Input
            type="password"
            value={settings.googleAiToken || ''}
            onChange={onChangeGoogleAiToken}
            placeholder="Enter your Google AI API Token"
          />
          <Explanation title={explanations.ai.token} />
        </div>
        <div className="relative flex flex-col">
          <Label>{'Google AI Model'}</Label>
          <Select
            options={googleAiModels}
            value={settings.googleAiModel || 'gemini-2.0-flash-exp'}
            onChange={onChangeGoogleAiModel}
          />
          <Explanation title={explanations.ai.model} />
        </div>
        <SeparatorFull />
        <Text variant="button">{'Global'}</Text>
        <div className="relative flex flex-col">
          <Label>{'Input Mode'}</Label>
          <Select
            options={[
              { name: 'Normal', value: 'normal' },
              { name: 'Single', value: 'single' },
              { name: 'Multiple', value: 'multiple' }
            ]}
            value={settings.inputMode}
            onChange={onChangeInputMode}
          />
          <Explanation title={inputModeHtml(settings.inputMode)} />
        </div>
      </div>
    </PageContainer>
  )
}
