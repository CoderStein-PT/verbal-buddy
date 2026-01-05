import {
  Select,
  Text,
  Input,
  Label,
  SeparatorFull,
  Switch,
  OptionType,
  inputModeHtml,
  Button
} from 'ui'
import { PageContainer } from 'components'
import { useStore } from 'store'
import { getCurrentVoice, pronounce, recognitionLangs } from 'utils'
import { FaQuestionCircle } from '@react-icons/all-files/fa/FaQuestionCircle'
import { TooltipWrapper } from 'react-tooltip'
import { useVoiceStore } from 'voice-store'
import { Presets } from './presets'
import { LanguagePresets } from './language-presets'
import { useUiStore } from 'ui-store'
import { useI18n } from 'i18n'

export const googleAiModels = [
  { name: 'Gemini 3.0 Flash', value: 'gemini-3-flash-preview' },
  { name: 'Gemini 2.5 Flash', value: 'gemini-2.5-flash' },
]

export const Explanation = ({ translationKey }: { translationKey: string }) => {
  const { t } = useI18n()
  return (
    <div className="absolute top-0 right-0 cursor-pointer">
      <TooltipWrapper html={t(translationKey as any)} place="right">
        <FaQuestionCircle className="text-gray-400" />
      </TooltipWrapper>
    </div>
  )
}

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
  const { t } = useI18n()
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

  const onChangeSpeechRate = (e: React.ChangeEvent<HTMLInputElement>) => {
    useStore.setState((state) => ({
      settings: { ...state.settings, speechRate: +e.target.value }
    }))
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
        <Text variant="button">{t('guessGames')}</Text>
        <div className="relative flex flex-col">
          <Label>{t('guessMaxWords')}</Label>
          <Input
            min={10}
            max={10000}
            type="number"
            value={settings.guessMaxWords}
            onChange={onChangeGuessMaxWords}
          />
          <Explanation translationKey="maxWordsGuessExplanation" />
        </div>
        <div className="relative flex flex-col">
          <Label>{t('pronounceDefinitionsLabel')}</Label>
          <Switch
            checked={settings.guessPronounceDefinitions}
            onChange={onChangePronounceDefinitions}
          />
          <Explanation translationKey="pronounceDefinitionsExplanation" />
        </div>
        <SeparatorFull />
        <Text variant="button">{t('voice')}</Text>
        <div className="relative flex flex-col">
          <Label>{t('pronunciationVoice')}</Label>
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
            <Text color="gray-light">{t('loadingVoices')}</Text>
          )}
          <Explanation translationKey="pronunciationExplanation" />
        </div>
        <div className="relative flex flex-col">
          <Label>{t('speechRate')}</Label>
          <Input
            min={0.5}
            max={2}
            step={0.1}
            type="number"
            value={settings.speechRate || 1}
            onChange={onChangeSpeechRate}
          />
          <Explanation translationKey="speechRateExplanation" />
        </div>
        <div className="relative flex flex-col">
          <Label>{t('useSpeechRecognitionLabel')}</Label>
          <Switch
            checked={settings.useSpeechRecognition}
            onChange={onChangeUseSpeechRecognition}
          />
          <Explanation translationKey="useSpeechRecognitionExplanation" />
        </div>
        <div className="relative flex flex-col">
          <Label>{t('recognitionVoice')}</Label>
          <Select
            options={recognitionLangs.map((lang) => ({
              ...lang,
              value: lang.code
            }))}
            value={settings.speechRecognitionLang}
            onChange={onChangeSpeechRecognitionLang}
          />
          <Explanation translationKey="recognitionExplanation" />
        </div>
        <SeparatorFull />
        <Text variant="button">{t('practice')}</Text>
        <div className="relative flex flex-col">
          <Label>{t('practiceMaxWordsLabel')}</Label>
          <Input
            min={10}
            max={10000}
            type="number"
            value={settings.practiceMaxWords}
            onChange={onChangePracticeMaxWords}
          />
          <Explanation translationKey="maxWordsPracticeExplanation" />
        </div>
        <div className="relative flex flex-col">
          <Label>{t('practiceTypingDelay')}</Label>
          <Input
            min={0}
            max={10}
            step={0.1}
            type="number"
            value={settings.practiceDelayTolerance || 1}
            onChange={onChangePracticeDelayTolerance}
          />
          <Explanation translationKey="delayToleranceExplanation" />
        </div>
        <div className="relative flex flex-col">
          <Label>{t('voiceFeedbackLabel')}</Label>
          <Switch
            checked={settings.practiceVoiceFeedback}
            onChange={onChangePracticeVoiceFeedback}
          />
          <Explanation translationKey="voiceFeedbackExplanation" />
        </div>
        <div className="relative flex flex-col">
          <Label>{t('startTimerRightAway')}</Label>
          <Switch
            checked={settings.practiceStartRightAway}
            onChange={onChangeStartRightAway}
          />
          <Explanation translationKey="startRightAwayExplanation" />
        </div>
        <div className="relative flex flex-col">
          <Label>{t('practiceCountdownLabel')}</Label>
          <Input
            min={0}
            max={10}
            step={0.1}
            type="number"
            value={settings.practiceCountdown || 3}
            onChange={onChangePracticeCountdown}
          />
          <Explanation translationKey="countdownExplanation" />
        </div>
        <SeparatorFull />
        <Text variant="button">{t('jokes')}</Text>
        <div className="relative flex flex-col">
          <Label>{t('randomWordsSelector')}</Label>
          <Input
            min={1}
            max={10}
            type="number"
            value={settings.randomWords}
            onChange={onChangeRandomWords}
          />
          <Explanation translationKey="randomWordsExplanation" />
        </div>
        <SeparatorFull />
        <Text variant="button">{t('ai')}</Text>
        <div className="relative flex flex-col">
          <Label>{t('googleAiTokenLabel')}</Label>
          <Input
            type="password"
            value={settings.googleAiToken || ''}
            onChange={onChangeGoogleAiToken}
            placeholder={t('enterGoogleAiToken')}
          />
          <Explanation translationKey="aiTokenExplanation" />
        </div>
        <div className="relative flex flex-col">
          <Label>{t('googleAiModelLabel')}</Label>
          <Select
            options={googleAiModels}
            value={settings.googleAiModel || googleAiModels[0].value}
            onChange={onChangeGoogleAiModel}
          />
          <Explanation translationKey="aiModelExplanation" />
        </div>
        <SeparatorFull />
        <Text variant="button">{t('global')}</Text>
        <div className="relative flex flex-col">
          <Label>{t('inputModeLabel')}</Label>
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
        <SeparatorFull />
        <div className="relative flex flex-col">
          <Label>{t('onboarding')}</Label>
          <Button
            color="grayPrimary"
            onClick={() => {
              useUiStore.setState({ hasCompletedOnboarding: false })
              window.location.reload()
            }}
          >
            {t('resetOnboarding')}
          </Button>
          <Text variant="subtitle" color="gray-light" className="mt-2">
            {t('onboardingDescription')}
          </Text>
        </div>
      </div>
    </PageContainer>
  )
}
