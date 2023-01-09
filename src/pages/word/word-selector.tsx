import { FiChevronLeft } from '@react-icons/all-files/fi/FiChevronLeft'
import {
  Button,
  Text,
  ScrollableContainer,
  ListContainer,
  SeparatorFull,
  Row
} from 'components'
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
        <Text className="group-hover:text-primary-500">{category.name}</Text>
      </div>
    </div>
  )
}

export const Categories = ({
  setSelectedCategoryId,
  height,
  maxHeight
}: {
  setSelectedCategoryId: any
  height?: number
  maxHeight?: number
}) => {
  const categories = useStore((state) => state.categories)
  return (
    <ScrollableContainer height={height} maxHeight={maxHeight}>
      <div className="px-2">
        {categories.map((category) => (
          <Category
            key={category.id}
            category={category}
            setSelectedCategoryId={setSelectedCategoryId}
          />
        ))}
      </div>
    </ScrollableContainer>
  )
}

export const Word = ({
  word,
  onSelectWord,
  selectedWords,
  index
}: {
  word: WordType
  onSelectWord: any
  selectedWords: WordType[]
  index?: number
}) => {
  const isSelected = !!selectedWords.find((w) => w.id === word.id)

  const onClick = () => {
    if (isSelected) return

    onSelectWord(word)
  }

  return (
    <Row
      text={word.text}
      isSelected={isSelected}
      onClick={onClick}
      index={index}
    />
  )
}

export const Words = ({
  categoryId,
  selectedWords,
  onSelectWord,
  height,
  maxHeight
}: {
  categoryId: number
  selectedWords: WordType[]
  onSelectWord: any
  height?: number
  maxHeight?: number
}) => {
  const words = useStore((state) =>
    state.words.filter((w) => w.categoryId === categoryId)
  )

  return (
    <ScrollableContainer height={height} maxHeight={maxHeight}>
      <div className="px-2">
        {words.map((word, index) => (
          <Word
            onSelectWord={onSelectWord}
            selectedWords={selectedWords}
            key={word.id}
            word={word}
            index={index + 1}
          />
        ))}
      </div>
    </ScrollableContainer>
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
  wordSelector,
  height,
  maxHeight
}: {
  wordSelector: ReturnType<typeof useWordSelector>
  height?: number
  maxHeight?: number
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
    <ListContainer>
      <div className="flex px-2 space-x-2">
        {!!selectedCategoryId && (
          <Button
            color="gray"
            size="sm"
            onClick={() => setSelectedCategoryId(null)}
          >
            <FiChevronLeft className="w-full h-full" />
          </Button>
        )}
        <Text variant="button">
          {category ? category.name : 'Choose a category'}
        </Text>
      </div>
      <SeparatorFull />
      <div className="mt-2">
        {selectedCategoryId ? (
          <div>
            <Words
              onSelectWord={onSelectWord}
              categoryId={selectedCategoryId}
              selectedWords={selectedWords}
              height={height}
              maxHeight={maxHeight}
            />
          </div>
        ) : (
          <Categories
            height={height}
            maxHeight={maxHeight}
            setSelectedCategoryId={setSelectedCategoryId}
          />
        )}
      </div>
    </ListContainer>
  )
}
