import { Button, Text } from 'components'
import { useStore, WordType } from 'store'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'
import { useNavigate } from 'react-router-dom'
import { findLastId, isMobile, shuffleArray } from 'utils'
import { WordSelector } from './word/word-selector'
import { useWordSelector } from './word/use-words-selector'

export const Word = ({ word }: { word: WordType }) => {
  const isSelected = useStore((state) =>
    state.selectedWords.find((w) => w.id === word.id)
  )

  const onClick = () => {
    if (isSelected) return

    useStore.setState((state) => ({
      selectedWords: [...state.selectedWords, word]
    }))
  }

  return (
    <div className="flex justify-between space-x-1">
      <div className="w-full cursor-pointer group" onClick={onClick}>
        <Text
          className={isSelected ? '' : 'group-hover:text-primary-500'}
          color={isSelected ? 'gray-light' : undefined}
        >
          {word.text}
        </Text>
      </div>
    </div>
  )
}

export const SelectedWord = ({ word }: { word: WordType }) => {
  const onDeleteWord = () => {
    useStore.setState((state) => ({
      selectedWords: state.selectedWords.filter((w) => w.id !== word.id)
    }))
  }

  return (
    <div className="flex items-center justify-between space-x-1">
      <div className="w-full cursor-pointer group">
        <Text className="group-hover:text-primary-500">{word.text}</Text>
      </div>
      <div className="">
        <Button onClick={onDeleteWord} size="icon" color="red">
          <RiCloseFill className="w-full h-full" />
        </Button>
      </div>
    </div>
  )
}

export const SelectedWords = () => {
  const selectedWords = useStore((state) => state.selectedWords)

  return (
    <div>
      {selectedWords.map((word) => (
        <SelectedWord key={word.id} word={word} />
      ))}
      {selectedWords.length === 0 && (
        <div className="text-center">
          <Text color="gray-light" className="md:hidden">
            {'Please, select the words below.'}
          </Text>
          <Text color="gray-light" className="hidden md:block">
            {'Please, select the words from the list on the left.'}
          </Text>
        </div>
      )}
    </div>
  )
}

export const CreateJokePage = () => {
  const selectedWords = useStore((state) => state.selectedWords)

  const wordSelector = useWordSelector({
    selectedWords,
    onSelectWord: (word) => {
      useStore.setState((state) => ({
        selectedWords: [...state.selectedWords, word]
      }))
    }
  })

  const words = useStore((state) => state.words)

  const jokes = useStore((state) => state.jokes)

  const navigate = useNavigate()

  const onClick = () => {
    useStore.setState((state) => ({
      selectedWords: [],
      jokes: [
        ...state.jokes,
        {
          id: findLastId(state.jokes) + 1,
          wordIds: selectedWords.map((w) => w.id),
          text: '',
          draftText: '',
          premises: []
        }
      ]
    }))

    navigate(`/joke/${jokes.length + 1}`)
  }

  const settings = useStore((state) => state.settings)

  const selectRandomWords = () => {
    const newwords = wordSelector.selectedCategoryId
      ? words.filter((w) => w.categoryId === wordSelector.selectedCategoryId)
      : words

    const shuffledNewWords = shuffleArray(newwords)

    const randomWords = shuffledNewWords.slice(0, settings.randomWords)

    useStore.setState({ selectedWords: randomWords })
  }

  return (
    <div className="flex flex-col-reverse md:flex-row">
      <div className="md:w-[320px] w-full mx-auto mt-4 md:mt-0">
        <WordSelector wordSelector={wordSelector} />
        <Button
          onClick={selectRandomWords}
          className="w-full mt-4"
          color={isMobile() ? 'gray' : undefined}
          size={isMobile() ? 'sm' : 'md'}
        >
          {'Select random words'}
        </Button>
      </div>
      <div className="md:w-[320px] w-full mx-auto">
        <Text variant="h5">{'Selected words'}</Text>
        <div className="mt-4">
          <SelectedWords />
          <div className="mt-4">
            <Button
              disabled={!selectedWords.length}
              onClick={onClick}
              className="w-full"
            >
              {'Create Joke'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
