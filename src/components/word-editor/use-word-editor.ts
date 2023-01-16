import { useCallback, useMemo, useState } from 'react'

export const useWordEditor = ({ length }: { length: number }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [text, setText] = useState('')

  const selectNext = useCallback(() => {
    setSelectedIndex(Math.min(selectedIndex + 1, length - 1))
  }, [selectedIndex, length])

  const selectPrev = useCallback(() => {
    setSelectedIndex(Math.max(selectedIndex - 1, 0))
  }, [selectedIndex])

  return useMemo(
    () => ({
      selectedIndex,
      setSelectedIndex,
      selectNext,
      selectPrev,
      text,
      setText
    }),
    [selectedIndex, setSelectedIndex, selectNext, selectPrev, text, setText]
  )
}

export type UseWordEditorType = ReturnType<typeof useWordEditor>
