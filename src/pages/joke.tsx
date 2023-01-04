import { Button, Text } from 'components'
import { useState } from 'react'
import { useStore, CategoryType, WordType } from 'store'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'
import { useNavigate } from 'react-router-dom'

export const Category = ({
  category,
  setSelectedCategoryId
}: {
  category: CategoryType
  setSelectedCategoryId: any
}) => {
  const onClick = () => {
    setSelectedCategoryId(category.id)
  }

  return (
    <div className="flex justify-between space-x-1">
      <div className="w-full cursor-pointer group" onClick={onClick}>
        <Text className="group-hover:text-green-500">{category.name}</Text>
      </div>
    </div>
  )
}

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
          className={isSelected ? '' : 'group-hover:text-green-500'}
          color={isSelected ? 'gray-light' : undefined}
        >
          {word.text}
        </Text>
      </div>
    </div>
  )
}

export const SelectedWord = ({ word }: { word: WordType }) => {
  const onClick = () => {
    useStore.setState((state) => ({
      selectedWords: [...state.selectedWords, word]
    }))
  }

  const onDeleteWord = () => {
    useStore.setState((state) => ({
      selectedWords: state.selectedWords.filter((w) => w.id !== word.id)
    }))
  }

  return (
    <div className="flex justify-between space-x-1">
      <div className="w-full cursor-pointer group" onClick={onClick}>
        <Text className="group-hover:text-green-500">{word.text}</Text>
      </div>
      <Button onClick={onDeleteWord} size="icon" color="red">
        <RiCloseFill className="w-full h-full" />
      </Button>
    </div>
  )
}

export const Categories = ({ setSelectedCategoryId }: any) => {
  const categories = useStore((state) => state.categories)
  return (
    <div>
      {categories.map((category) => (
        <Category
          key={category.id}
          category={category}
          setSelectedCategoryId={setSelectedCategoryId}
        />
      ))}
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
    </div>
  )
}

export const Words = ({ categoryId }: { categoryId: number }) => {
  const words = useStore((state) => state.words)

  return (
    <div>
      {words
        .filter((w) => w.categoryId === categoryId)
        .map((word) => (
          <Word key={word.id} word={word} />
        ))}
    </div>
  )
}

export const JokePage = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)

  const selectedWords = useStore((state) => state.selectedWords)

  const navigate = useNavigate()

  const onClick = () => {
    navigate('/joke/new/write')
  }

  return (
    <div className="flex">
      <div className="w-[320px] mx-auto">
        <Text variant="h5">{'Choose a word'}</Text>
        <div className="mt-4">
          {selectedCategoryId ? (
            <div>
              <Button onClick={() => setSelectedCategoryId(null)}>
                {'Back'}
              </Button>
              <Words categoryId={selectedCategoryId} />
            </div>
          ) : (
            <Categories setSelectedCategoryId={setSelectedCategoryId} />
          )}
        </div>
      </div>
      <div className="w-[320px] mx-auto">
        <Text variant="h5">{'Selected words'}</Text>
        <div className="mt-4">
          <SelectedWords />
          <div className="mt-4">
            <Button
              disabled={!selectedWords.length}
              onClick={onClick}
              className="w-full"
            >
              {'Start'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
