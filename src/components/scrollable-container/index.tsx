import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import tw from 'tailwind-styled-components'
import { mergeRefs } from 'react-merge-refs'
import React from 'react'

export const Gradient = tw.div`absolute transition duration-300 z-10 left-0 right-0 h-16 from-transparent to-gray-900 pointer-events-none`
export const GradientTop = tw(Gradient)`top-0 bg-gradient-to-t`
export const GradientBottom = tw(Gradient)`bottom-0 bg-gradient-to-b`

export const useScrollableContainer = ({
  scrollOnLoad
}: {
  scrollOnLoad?: boolean
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const scrollDown = useCallback(() => {
    setTimeout(() => {
      containerRef.current?.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }, 0)
  }, [])

  useEffect(() => {
    if (!scrollOnLoad) return

    scrollDown()
  }, [scrollOnLoad])

  return useMemo(
    () => ({ containerRef, scrollDown }),
    [containerRef, scrollDown]
  )
}

export type ScrollableContainerType = ReturnType<typeof useScrollableContainer>

// eslint-disable-next-line react/display-name
export const ScrollableContainer = ({
  children,
  height,
  maxHeight = 400,
  scrollableContainer
}: {
  children: React.ReactNode
  height?: number
  maxHeight?: number
  scrollableContainer?: ScrollableContainerType
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const [scroll, setScroll] = useState(0)
  const [isScrollable, setIsScrollable] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    const { scrollHeight, clientHeight } = containerRef.current

    setIsScrollable(scrollHeight > clientHeight)
  }, [])

  const onScroll = useCallback(() => {
    if (!containerRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current

    setScroll(scrollTop)
    setIsScrollable(scrollHeight > clientHeight)
  }, [])

  const ref = useMemo(
    () =>
      scrollableContainer
        ? mergeRefs([containerRef, scrollableContainer?.containerRef])
        : containerRef,
    [scrollableContainer, containerRef]
  )

  return (
    <div className="relative">
      {isScrollable && (
        <GradientTop className={scroll > 0 ? '' : 'opacity-0'} />
      )}
      <div
        className="relative overflow-y-auto"
        ref={ref}
        onScroll={onScroll}
        style={{
          height: height ? height + 'px' : 'auto',
          maxHeight: maxHeight + 'px'
        }}
      >
        {children}
      </div>
      {isScrollable && (
        <GradientBottom
          className={
            (containerRef?.current?.scrollHeight || 0) - scroll >
            (containerRef?.current?.clientHeight || 0)
              ? ''
              : 'opacity-0'
          }
        />
      )}
    </div>
  )
}
