import {
  ScrollableContainer,
  ScrollableContainerType,
  FloatingSelector
} from 'components'
import { Text } from 'ui'
import { WordType } from 'store'
import { Word } from './word'
import React from 'react'

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
