import {
  ScrollableContainer,
  ScrollableContainerType,
  ControllableListContext
} from 'components'
import { Text } from 'ui'
import { WordType } from 'store'
import { Word } from './word'
import { useContext, useMemo } from 'react'
import tw from 'tailwind-styled-components'
import React from 'react'

const FloatingSelectorDiv = tw.div`absolute top-0 left-0 bg-gradient-to-r from-green-500 to-transparent w-full opacity-25 rounded-sm transition duration-75 ease-cool`

const FloatingSelector = ({
  scrollableContainer
}: {
  scrollableContainer: ScrollableContainerType
}) => {
  const controllableList = useContext(ControllableListContext)

  // floating selector has to be positioned over the scrollableContainer.containerRef.current's inside div's child that is selected by controllableList.selectedIdx
  // so we need to get the position of that child and set the position of the floating selector to that position
  const floatingSelectorPosition = useMemo(() => {
    if (!controllableList) return { top: 0, left: 0 }
    if (controllableList.selectedIdx === null) return { top: 0, left: 0 }

    const div = scrollableContainer.containerRef?.current?.querySelector(
      'div'
    ) as HTMLDivElement

    const element = div.children[controllableList.selectedIdx] as HTMLDivElement

    if (!element) return { top: 0, left: 0 }

    const elementHeight = element.clientHeight

    const elementTop = element.offsetTop
    const elementLeft = element.offsetLeft

    return { top: elementTop, left: elementLeft, height: elementHeight }
  }, [controllableList, scrollableContainer])

  const transform = useMemo(() => {
    return `translate(${floatingSelectorPosition.left}px, ${floatingSelectorPosition.top}px)`
  }, [floatingSelectorPosition])

  return (
    <FloatingSelectorDiv
      style={{ transform, height: floatingSelectorPosition.height + 'px' }}
    />
  )
}

export const WordsCore = ({
  words,
  scrollableContainer
}: {
  words: WordType[]
  scrollableContainer: ScrollableContainerType
}) => {
  if (!words.length)
    return (
      <Text color="gray-light" className="text-center">
        {'No words yet. Add some! 🔥'}
      </Text>
    )

  return (
    <ScrollableContainer scrollableContainer={scrollableContainer}>
      <div className="z-[1] relative px-2" data-test="words-list">
        {words.map((word, index) => (
          <Word key={word.id} index={index + 1} word={word} />
        ))}
      </div>
      <FloatingSelector scrollableContainer={scrollableContainer} />
    </ScrollableContainer>
  )
}

export const Words = React.memo(WordsCore)
