import { useStore } from 'store'
import { pronounce } from 'utils'
import { getNewRecognition } from 'utils/use-speech-recognition'
import create from 'zustand'

export type VoiceStoreType = {
  voices: SpeechSynthesisVoice[] | null
  recognition: SpeechRecognition | null
  startRecognition: () => void
  stopRecognition: () => void
}

export const useVoiceStore = create<VoiceStoreType>((set, get) => ({
  voices: null,
  recognition: getNewRecognition(),
  startRecognition: () => {
    const recognition = get().recognition
    if (!recognition) return

    recognition.start()
    pronounce('Voice recognition started')

    recognition.onend = () => {
      useStore.getState().settings.useSpeechRecognition && recognition?.start()
    }
  },
  stopRecognition: () => {
    const recognition = get().recognition
    if (!recognition) return

    recognition.onend = () => {}
    recognition.stop()
  }
}))
