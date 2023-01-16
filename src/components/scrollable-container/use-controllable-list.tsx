import { ScrollableContainerType } from 'components'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useThrottle } from 'react-use'

export type ControllableListType = ReturnType<typeof useControllableList>

export const useControllableList = ({
  onEnter,
  onDelete,
  length,
  scrollableContainer
}: {
  onEnter: (itemIdx: number) => void
  onDelete?: (itemIdx: number) => void
  length: number
  scrollableContainer: ScrollableContainerType
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const debouncedSelectedIdx = useThrottle(selectedIdx, 100)

  const scrollToSelected = useCallback((selectedIdx: number) => {
    if (selectedIdx === null) return

    const div = scrollableContainer.containerRef?.current?.querySelector(
      'div'
    ) as HTMLDivElement

    const element = div.children[selectedIdx] as HTMLDivElement

    if (!element) return

    const containerHeight =
      scrollableContainer.containerRef?.current?.clientHeight
    const elementHeight = element.clientHeight
    const elementTop = element.offsetTop

    const containerScrollTop =
      scrollableContainer.containerRef?.current?.scrollTop

    if (
      elementTop + elementHeight >
      (containerScrollTop || 0) + (containerHeight || 0)
    ) {
      scrollableContainer.containerRef?.current?.scrollTo({
        top: elementTop + elementHeight - (containerHeight || 0),
        behavior: 'auto'
      })
    }

    if (elementTop < (containerScrollTop || 0)) {
      scrollableContainer.containerRef?.current?.scrollTo({
        top: elementTop,
        behavior: 'auto'
      })
    }
  }, [])

  useEffect(() => {
    scrollToSelected(debouncedSelectedIdx || 0)
  }, [debouncedSelectedIdx])

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'ArrowUp') {
        if (length === 0) return false
        setSelectedIdx((s) => Math.max(0, s === null ? 0 : s - 1))
        return true
      }

      if (event.key === 'ArrowDown') {
        if (length === 0) return false
        setSelectedIdx((s) => Math.min(length - 1, s === null ? 0 : s + 1))
        return true
      }

      if (event.key === 'Enter') {
        if (selectedIdx === null) return false
        onEnter(selectedIdx)
        return true
      }

      if (event.key === 'Backspace' || event.key === 'Delete') {
        if (selectedIdx === null) return false
        onDelete?.(selectedIdx)
        setSelectedIdx(null)
        return true
      }

      setSelectedIdx(null)

      return false
    },
    [selectedIdx, length, onEnter, onDelete]
  )

  return useMemo(
    () => ({ selectedIdx, setSelectedIdx, onKeyDown }),
    [selectedIdx, setSelectedIdx, onKeyDown]
  )
}
