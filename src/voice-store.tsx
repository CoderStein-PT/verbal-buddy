import { getNewRecognition } from 'utils/use-speech-recognition'
import create from 'zustand'

export type VoiceStoreType = {
  voices: SpeechSynthesisVoice[] | null
  recognition: SpeechRecognition | null
}

export const useVoiceStore = create<VoiceStoreType>((set) => ({
  voices: null,
  recognition: getNewRecognition()
}))
