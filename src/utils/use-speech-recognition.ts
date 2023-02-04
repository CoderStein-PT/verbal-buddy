import { useVoiceStore } from 'voice-store'
import { useEffect } from 'react'
import { useStore } from 'store'

export const recognitionLangs = [
  { name: 'Chinese (China)', code: 'zh-CN' },
  { name: 'Danish (Denmark)', code: 'da-DK' },
  { name: 'Dutch (Netherlands)', code: 'nl-NL' },
  { name: 'English (United States)', code: 'en-US' },
  { name: 'French (France)', code: 'fr-FR' },
  { name: 'German (Germany)', code: 'de-DE' },
  { name: 'Italian (Italy)', code: 'it-IT' },
  { name: 'Japanese (Japan)', code: 'ja-JP' },
  { name: 'Korean (Korea)', code: 'ko-KR' },
  { name: 'Norwegian (Norway)', code: 'no-NO' },
  { name: 'Polish (Poland)', code: 'pl-PL' },
  { name: 'Portuguese (Brazil)', code: 'pt-BR' },
  { name: 'Portuguese (Portugal)', code: 'pt-PT' },
  { name: 'Russian (Russia)', code: 'ru-RU' },
  { name: 'Spanish (Spain)', code: 'es-ES' },
  { name: 'Turkish (Turkey)', code: 'tr-TR' },
  { name: 'Ukrainian (Ukraine)', code: 'uk-UA' }
]

export const getNewRecognition = () => {
  if (typeof window === 'undefined') return null

  const speechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition

  if (!speechRecognition) return null
  const recognition = new speechRecognition()

  recognition.continuous = true
  recognition.interimResults = false
  recognition.maxAlternatives = 1
  return recognition
}

export const useSpeechRecognition = () => {
  const settings = useStore((state) => state.settings)
  const recognition = useVoiceStore((state) => state.recognition)
  const startRecognition = useVoiceStore((state) => state.startRecognition)

  useEffect(() => {
    if (!recognition) return
    recognition.lang = settings.speechRecognitionLang

    if (!recognition || !settings.useSpeechRecognition) return

    startRecognition()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
