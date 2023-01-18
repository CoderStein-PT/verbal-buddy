import { useEffect } from 'react'
import { useStore } from 'store'
import { getVoices } from 'utils'
import { useVoiceStore } from 'voice-store'

export const useSetupVoice = () => {
  const voice = useStore((state) => state.settings.voice)

  useEffect(() => {
    getVoices()
    window.speechSynthesis.onvoiceschanged = () => {
      const voices = getVoices()
      useVoiceStore.setState({ voices })

      const voiceURI =
        voices.find(
          (v) =>
            v.voiceURI ===
            (voice || 'Google US English' || 'English United States')
        ) || voices.find((v) => !!v.default)

      if (!voiceURI) return

      useStore.setState((s) => ({
        ...s,
        settings: { ...s.settings, voice: voiceURI.voiceURI }
      }))
    }
  }, [])
}
