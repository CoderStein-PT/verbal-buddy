import { useCallback, useMemo, useState } from 'react'

export const useWordEditor = ({ length }: { length: number }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

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
      selectPrev
    }),
    [selectedIndex, setSelectedIndex, selectNext, selectPrev]
  )
}

export type UseWordEditorType = ReturnType<typeof useWordEditor>
