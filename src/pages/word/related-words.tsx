import { Button, Row, ScrollableContainer, Text } from 'components'
import { RelatedWordType, useStore, WordType } from 'store'
import produce from 'immer'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'
import { useWordSelector, WordSelector } from './word-selector'
import { useState } from 'react'
import { findLastId } from 'utils'

const RelatedWord = ({
  word,
  relatedWord,
  onClick,
  words
}: {
  word: WordType
  words: WordType[]
  relatedWord: RelatedWordType
  onClick: (word: WordType) => void
}) => {
  const actualWord = words.find((w) => w.id === +relatedWord.wordId)

  const onRemoveRelatedWord = () => {
    useStore.setState((s) =>
      produce(s, (state) => {
        const wordIndex = state.words.findIndex((w) => w.id === word.id)
        const currentWord = state.words[wordIndex]
        if (!currentWord.relatedWords) return

        currentWord.relatedWords = currentWord.relatedWords.filter(
          (rw) => rw.wordId !== relatedWord.id
        )
      })
    )
  }

  if (!actualWord) return null

  return (
    <Row
      text={actualWord.text}
      onClick={() => onClick(actualWord)}
      actions={[
        {
          title: 'Delete',
          onClick: onRemoveRelatedWord,
          color: 'red',
          icon: RiCloseFill
        }
      ]}
    />
  )
}

export const RelatedWordsList = ({
  word,
  onWordClick,
  height,
  maxHeight
}: {
  word: WordType
  onWordClick: (word: WordType) => void
  height?: number
  maxHeight?: number
}) => {
  const words = useStore((s) => s.words)

  return (
    <ScrollableContainer height={height} maxHeight={maxHeight}>
      {word.relatedWords?.length ? (
        word.relatedWords?.map((relatedWord) => (
          <RelatedWord
            key={relatedWord.id}
            word={word}
            onClick={onWordClick}
            relatedWord={relatedWord}
            words={words}
          />
        ))
      ) : (
        <Text className="text-center" variant="subtitle" color="gray-light">
          {'No relations yet 🧐'}
        </Text>
      )}
    </ScrollableContainer>
  )
}

export const RelatedWords = ({
  word,
  onWordClick,
  height,
  maxHeight
}: {
  word: WordType
  onWordClick: (word: WordType) => void
  height?: number
  maxHeight?: number
}) => {
  const [showWords, setShowWords] = useState(false)
  const words = useStore.getState().words
  const wordSelector = useWordSelector({
    selectedWords: words.filter((w) =>
      word.relatedWords?.find((rw) => rw.wordId === w.id)
    ),
    onSelectWord: (rw) => {
      useStore.setState((s) =>
        produce(s, (state) => {
          const wordIndex = state.words.findIndex((w) => w.id === word.id)
          const currentWord = state.words[wordIndex]
          state.words[wordIndex].relatedWords = [
            ...(currentWord.relatedWords || []),
            {
              wordId: rw.id,
              id: findLastId(currentWord.relatedWords || []) + 1
            }
          ]
        })
      )
      setShowWords(false)
    }
  })

  return (
    <div>
      {showWords ? (
        <div className="px-2">
          <WordSelector
            height={height}
            maxHeight={maxHeight}
            wordSelector={wordSelector}
          />
        </div>
      ) : (
        <>
          <div className="px-2">
            <RelatedWordsList
              height={height}
              maxHeight={maxHeight}
              onWordClick={onWordClick}
              word={word}
            />
          </div>
          <div className="flex flex-col">
            <Button
              onClick={() => setShowWords(true)}
              size="sm"
              className="mt-2"
            >
              {'Add related word'}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
