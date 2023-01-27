import { useCallback, useEffect } from 'react'
import { useVoiceStore } from 'voice-store'

export type VoiceInputType = ReturnType<typeof useVoiceInput>

export const useVoiceInput = ({
  onResult
}: {
  onResult: (text: string) => void
}) => {
  const recognition = useVoiceStore((s) => s.recognition)

  const action = useCallback(
    (event: any) => {
      const last = event.results.length - 1
      const lastResult = event.results[last]
      if (!lastResult) return
      const text = lastResult[0]?.transcript
      if (!text) return

      onResult(text)
    },
    [onResult]
  )

  useEffect(() => {
    if (!recognition) return

    recognition.onresult = action
  }, [onResult, recognition, action])

  const refresh = () => {
    if (!recognition) return

    recognition.onresult = action
  }

  const onFocus = () => {
    refresh()
  }

  const onBlur = () => {
    if (!recognition) return

    recognition.onresult = null
  }

  return { onFocus, onBlur, refresh }
}
