import { Button, Text } from 'components'
import { useStore, WordType } from 'store'
import produce from 'immer'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'
import { useWordSelector, WordSelector } from './word-selector'
import { useState } from 'react'
import { findLastId } from 'utils'

const RelatedWord = ({
  word,
  relatedWord
}: {
  word: WordType
  relatedWord: WordType
}) => {
  const onRemoveRelatedWord = () => {
    useStore.setState((s) =>
      produce(s, (state) => {
        const wordIndex = state.words.findIndex((w) => w.id === word.id)
        const relatedWords = state.words[wordIndex].relatedWords
        if (!relatedWords) return

        state.words[wordIndex].relatedWords = relatedWords.filter(
          (rw) => rw.wordId !== relatedWord.id
        )
      })
    )
  }

  return (
    <div className="flex items-center justify-between">
      <Text variant="subtitle" className="group-hover:text-green-500">
        {relatedWord.text}
      </Text>
      <div className="flex space-x-1">
        <div>
          <Button
            onClick={onRemoveRelatedWord}
            title="Delete description"
            size="icon"
            color="red"
          >
            <RiCloseFill className="w-full h-full" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export const RelatedWordsList = ({ word }: { word: WordType }) => {
  const words = useStore.getState().words

  return (
    <div className="space-y-1">
      {word?.relatedWords?.map((relatedWord) => (
        <RelatedWord
          key={relatedWord.id}
          word={word}
          relatedWord={words.find((w) => w.id === +relatedWord.wordId)}
        />
      ))}
    </div>
  )
}

export const RelatedWords = ({ word }: { word: WordType }) => {
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
        <WordSelector wordSelector={wordSelector} />
      ) : (
        <>
          <RelatedWordsList word={word} />
          <div className="flex justify-end">
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
