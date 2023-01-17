import {
  ScrollableContainerType,
  ControllableListContext
} from 'components/scrollable-container'
import { useContext, useRef, useMemo } from 'react'
import tw from 'tailwind-styled-components'

const FloatingSelectorDiv = tw.div`absolute top-0 left-0 bg-gradient-to-r from-green-500 to-transparent w-3/4 opacity-25 rounded-sm transition duration-75 ease-cool pointer-events-none`

export const FloatingSelector = ({
  scrollableContainer
}: {
  scrollableContainer: ScrollableContainerType
}) => {
  const controllableList = useContext(ControllableListContext)

  const divContainer = useRef<HTMLDivElement>(null)

  const floatingSelectorPosition = useMemo(() => {
    if (!controllableList || controllableList.selectedIdx === null)
      return { top: 0, left: 0 }

    if (!divContainer.current) {
      const div = scrollableContainer.containerRef?.current?.querySelector(
        'div'
      ) as HTMLDivElement
      divContainer.current = div
    }

    const element = divContainer.current?.children[
      controllableList.selectedIdx
    ] as HTMLDivElement

    if (!element) return { top: 0, left: 0 }

    const elementHeight = element.clientHeight

    const elementTop = element.offsetTop
    const elementLeft = element.offsetLeft

    return { top: elementTop, left: elementLeft, height: elementHeight }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controllableList, divContainer])

  const transform = useMemo(() => {
    return `translate(${floatingSelectorPosition.left}px, ${floatingSelectorPosition.top}px)`
  }, [floatingSelectorPosition])

  return (
    <FloatingSelectorDiv
      style={{
        transform,
        height: floatingSelectorPosition.height + 'px',
        opacity: controllableList?.selectedIdx === null ? 0 : undefined
      }}
      data-test="list-floating-selector"
    />
  )
}
