import create from 'zustand'

export type VoiceStoreType = {
  voices: SpeechSynthesisVoice[] | null
}

export const useVoiceStore = create<VoiceStoreType>((set) => ({
  voices: null
}))
