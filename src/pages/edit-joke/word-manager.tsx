import { Text } from 'ui'
import { useStore, JokeType, WordType } from 'store'
import {
  WordEditor,
  WordSelector,
  useWordSelector,
  useWordEditor
} from 'components'
import { HiPlus } from '@react-icons/all-files/hi/HiPlus'
import { useState } from 'react'
import produce from 'immer'
import tw from 'tailwind-styled-components'
import { useI18n } from 'i18n'

const Column = tw.div`md:w-1/3 w-full flex-shrink-0 flex-grow-0 relative`

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

      useStore.setState((s) =>
        produce(s, (draft) => {
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
        <WordSelector height={280} wordSelector={wordSelector} />
      ) : (
        <div
          onClick={onClick}
          className="flex flex-col items-center justify-center w-full h-full transition border-2 border-gray-700 border-dashed rounded-lg cursor-pointer hover:border-primary-500 group"
        >
          <HiPlus className="w-12 h-12 text-gray-700 transition group-hover:text-primary-500" />
          <Text
            color="gray-light"
            variant="button"
            className="group-hover:text-primary-500"
          >
            {t('addNewWord')}
          </Text>
        </div>
      )}
    </div>
  )
}

const WordEditorWrapped = ({
  word,
  joke
}: {
  word: WordType
  joke: JokeType
}) => {
  const wordEditor = useWordEditor({ length: 3 })

  const onDeleteClick = (word: WordType) => {
    useStore.setState((s) =>
      produce(s, (draft) => {
        const currentJoke = draft.jokes.find((j) => j.id === joke.id)

        if (!currentJoke?.wordIds) return

        currentJoke.wordIds = currentJoke.wordIds.filter((id) => id !== word.id)
      })
    )
  }

  return (
    <WordEditor
      height={200}
      word={word}
      onDeleteClick={() => onDeleteClick(word)}
      wordEditor={wordEditor}
    />
  )
}

export const WordManager = ({ joke }: { joke: JokeType }) => {
  const words = useStore((state) => state.words)

  const wordsToLoop =
    (joke.wordIds
      ?.map((id) => words.find((w) => w.id === id))
      .filter((e) => e) as WordType[]) || []

  return (
    <div className="pb-1 overflow-x-auto">
      <div className="flex space-x-2 md:space-x-4">
        {wordsToLoop.map((word) => (
          <Column key={word?.id}>
            <WordEditorWrapped word={word} joke={joke} />
          </Column>
        ))}
        <Column>
          <AddNewWord selectedWords={wordsToLoop} joke={joke} />
        </Column>
      </div>
    </div>
  )
}
