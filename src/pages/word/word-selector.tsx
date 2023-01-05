import { FiChevronLeft } from '@react-icons/all-files/fi/FiChevronLeft'
import { Button, Text } from 'components'
import { useState } from 'react'
import { useStore, CategoryType, WordType } from 'store'

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
export const Word = ({
  word,
  onSelectWord,
  selectedWords
}: {
  word: WordType
  onSelectWord: any
  selectedWords: WordType[]
}) => {
  const isSelected = selectedWords.find((w) => w.id === word.id)

  const onClick = () => {
    if (isSelected) return

    onSelectWord(word)
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

export const Words = ({
  categoryId,
  selectedWords,
  onSelectWord
}: {
  categoryId: number
  selectedWords: WordType[]
  onSelectWord: any
}) => {
  const words = useStore((state) => state.words)

  return (
    <div className="max-h-[500px] overflow-y-auto">
      {words
        .filter((w) => w.categoryId === categoryId)
        .map((word) => (
          <Word
            onSelectWord={onSelectWord}
            selectedWords={selectedWords}
            key={word.id}
            word={word}
          />
        ))}
    </div>
  )
}

export const useWordSelector = ({
  onSelectWord = () => {},
  selectedWords = []
}: {
  onSelectWord?: (word: WordType) => void
  selectedWords?: WordType[]
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)

  return {
    selectedCategoryId,
    setSelectedCategoryId,
    onSelectWord,
    selectedWords
  }
}

export const WordSelector = ({
  wordSelector
}: {
  wordSelector: ReturnType<typeof useWordSelector>
}) => {
  const {
    selectedCategoryId,
    setSelectedCategoryId,
    onSelectWord,
    selectedWords
  } = wordSelector

  const category = useStore((state) =>
    state.categories.find((c) => c.id === selectedCategoryId)
  )

  return (
    <div>
      <div className="flex space-x-2">
        {!!selectedCategoryId && (
          <Button
            color="gray"
            size="icon"
            onClick={() => setSelectedCategoryId(null)}
          >
            <FiChevronLeft className="w-full h-full" />
          </Button>
        )}
        <Text variant="button">
          {category ? category.name : 'Choose a category'}
        </Text>
      </div>
      <div className="mt-4">
        {selectedCategoryId ? (
          <div>
            <Words
              onSelectWord={onSelectWord}
              categoryId={selectedCategoryId}
              selectedWords={selectedWords}
            />
          </div>
        ) : (
          <Categories setSelectedCategoryId={setSelectedCategoryId} />
        )}
      </div>
    </div>
  )
}
