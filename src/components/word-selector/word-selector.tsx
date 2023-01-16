import { FiChevronLeft } from '@react-icons/all-files/fi/FiChevronLeft'
import { FiCheck } from '@react-icons/all-files/fi/FiCheck'
import { ScrollableContainer, ListContainer, Row } from 'components'
import { Button, Text, SeparatorFull } from 'ui'
import { useStore, CategoryType, WordType } from 'store'
import { WordSelectorType } from './use-words-selector'

export const Category = ({
  category,
  onCategoryClick,
  active,
  index
}: {
  category: CategoryType
  onCategoryClick: (category: CategoryType) => void
  active?: boolean
  index?: number
}) => {
  const onClick = () => {
    onCategoryClick(category)
  }

  return (
    <Row
      text={category.name}
      isSelected={active}
      onClick={onClick}
      index={index}
      selectedColor="primary"
      info={
        active
          ? [{ title: 'Selected', icon: FiCheck, class: 'text-green-500' }]
          : undefined
      }
    />
  )
}

export const Categories = ({
  onCategoryClick,
  height,
  maxHeight,
  selectedCategories
}: {
  onCategoryClick: (category: CategoryType) => void
  height?: number
  maxHeight?: number
  selectedCategories?: CategoryType[]
}) => {
  const categories = useStore((state) => state.categories)

  return (
    <ScrollableContainer height={height} maxHeight={maxHeight}>
      <div className="px-2 my-1" data-test="categories-selector">
        {categories.map((category, index) => (
          <Category
            key={category.id}
            category={category}
            onCategoryClick={onCategoryClick}
            active={!!selectedCategories?.find((c) => c.id === category.id)}
            index={index + 1}
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
      actionsVisible
      selectedColor="primary"
      info={
        isSelected
          ? [{ title: 'Selected', icon: FiCheck, class: 'text-green-500' }]
          : undefined
      }
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

export const WordSelector = ({
  wordSelector,
  height,
  maxHeight
}: {
  wordSelector: WordSelectorType
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

  const onCategoryClick = (category: CategoryType) => {
    setSelectedCategoryId(category.id)
  }

  return (
    <ListContainer>
      <div className="flex px-2 space-x-2">
        {!!selectedCategoryId && (
          <Button
            color="text"
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
      <SeparatorFull />
      <div className="">
        {selectedCategoryId ? (
          <div className="my-1">
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
            onCategoryClick={onCategoryClick}
          />
        )}
      </div>
    </ListContainer>
  )
}
