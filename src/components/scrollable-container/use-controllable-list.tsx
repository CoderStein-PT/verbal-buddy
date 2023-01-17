import { ScrollableContainerType } from 'components'
import isHotkey from 'is-hotkey'
import React, { useRef } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useThrottle } from 'react-use'

export type ControllableListType = ReturnType<typeof useControllableList>

export const ControllableListContext =
  React.createContext<ControllableListType | null>(null)

export const useControllableList = ({
  onEnter,
  onDelete,
  length,
  scrollableContainer,
  onPronounce
}: {
  onEnter: (itemIdx: number) => void
  onDelete?: (itemIdx: number) => void
  length: number
  scrollableContainer: ScrollableContainerType
  onPronounce?: (itemIdx: number) => void
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const debouncedSelectedIdx = useThrottle(selectedIdx, 60)
  const [scrollAccumulator, setScrollAccumulator] = useState(1)
  const scrollAccumulatorInterval = useRef<number | null>(null)

  const scrollToSelected = useCallback((selectedIdx: number) => {
    if (selectedIdx === null) return

    const div = scrollableContainer.containerRef?.current?.querySelector(
      'div'
    ) as HTMLDivElement

    if (!div) return

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
    if (!scrollAccumulatorInterval.current) return

    scrollToSelected(debouncedSelectedIdx || 0)
  }, [debouncedSelectedIdx, scrollToSelected])

  const startScrollAccumulator = useCallback(() => {
    if (scrollAccumulatorInterval.current) return

    scrollAccumulatorInterval.current = window.setInterval(() => {
      setScrollAccumulator((s) => s + 2)
    }, 1500)
  }, [])

  const addIdx = useCallback(() => {
    if (length === 0) return
    setSelectedIdx((s) =>
      Math.min(
        length - scrollAccumulator,
        s === null ? 0 : s + scrollAccumulator
      )
    )
    startScrollAccumulator()
  }, [length, scrollAccumulator, startScrollAccumulator])

  const subtractIdx = useCallback(() => {
    if (length === 0) return
    setSelectedIdx((s) => Math.max(0, s === null ? 0 : s - scrollAccumulator))
    startScrollAccumulator()
  }, [length, scrollAccumulator, startScrollAccumulator])

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (isHotkey(['mod', 'opt'], e)) {
        return false
      }

      if (isHotkey('up', e)) {
        if (length === 0) return false
        subtractIdx()
        return true
      }

      if (isHotkey('down', e)) {
        if (length === 0) return false
        addIdx()
        return true
      }

      if (isHotkey('enter', e)) {
        if (selectedIdx === null) return false
        onEnter(selectedIdx)
        setSelectedIdx(null)
        return true
      }

      if (isHotkey('mod+s', e)) {
        if (selectedIdx === null) return false
        e.preventDefault()
        onPronounce?.(selectedIdx)
        return true
      }

      if (isHotkey(['del', 'backspace'], e)) {
        if (selectedIdx === null) return false
        onDelete?.(selectedIdx)
        subtractIdx()
        return true
      }

      setSelectedIdx(null)

      return false
    },
    [selectedIdx, length, onEnter, onDelete, addIdx, subtractIdx]
  )

  const onKeyUp = useCallback(() => {
    if (scrollAccumulatorInterval.current) {
      window.clearInterval(scrollAccumulatorInterval.current)
      scrollAccumulatorInterval.current = null
    }
    setScrollAccumulator(1)
    return false
  }, [])

  return useMemo(
    () => ({ selectedIdx, setSelectedIdx, onKeyDown, onKeyUp }),
    [selectedIdx, setSelectedIdx, onKeyDown, onKeyUp]
  )
}
