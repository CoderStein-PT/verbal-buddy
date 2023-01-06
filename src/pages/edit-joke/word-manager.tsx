import { Text } from 'components'
import { useStore, JokeType, WordType } from 'store'
import { WordEditor } from '../word/word-editor'
import { HiPlus } from '@react-icons/all-files/hi/HiPlus'
import { useState } from 'react'
import { useWordSelector, WordSelector } from '../word/word-selector'
import produce from 'immer'
import tw from 'tailwind-styled-components'

const Column = tw.div`w-[400px] flex-shrink-0 flex-grow-0 relative`

const AddNewWord = ({
  joke,
  selectedWords
}: {
  joke: JokeType
  selectedWords: WordType[]
}) => {
  const [clicked, setClicked] = useState(false)

  const onClick = () => {
    setClicked(true)
  }

  const wordSelector = useWordSelector({
    selectedWords,
    onSelectWord: (word) => {
      setClicked(false)

      useStore.setState((state) =>
        produce(state, (draft) => {
          const currentJoke = draft.jokes.find((j) => j.id === joke.id)

          if (!currentJoke?.wordIds) return

          currentJoke.wordIds.push(word.id)
        })
      )
    }
  })

  return (
    <div className="w-full h-full">
      {clicked ? (
        <WordSelector wordSelector={wordSelector} />
      ) : (
        <div
          onClick={onClick}
          className="flex flex-col items-center justify-center w-full h-full border-2 border-gray-700 border-dashed rounded-lg cursor-pointer"
        >
          <HiPlus className="w-12 h-12 text-gray-700" />
          <Text color="gray-light" variant="subtitle">
            {'Add new word'}
          </Text>
        </div>
      )}
    </div>
  )
}
export const WordManager = ({ joke }: { joke: JokeType }) => {
  const words = useStore((state) => state.words)

  const wordsToLoop =
    (joke.wordIds
      ?.map((id) => words.find((w) => w.id === id))
      .filter((e) => e) as WordType[]) || []

  return (
    <div className="overflow-x-auto">
      <div className="flex space-x-4">
        {wordsToLoop.map((word) => (
          <Column key={word?.id}>
            <WordEditor word={word} />
          </Column>
        ))}
        <Column>
          <AddNewWord selectedWords={wordsToLoop} joke={joke} />
        </Column>
      </div>
    </div>
  )
}
