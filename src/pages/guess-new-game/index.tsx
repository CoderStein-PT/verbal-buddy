import { Button, SeparatorFull, Text } from 'components'
import { PageContainer } from 'components/layout/container'
import { Categories } from 'pages/word/word-selector'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CategoryType, useStore } from 'store'

export const GuessNewGamePage = () => {
  const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>(
    []
  )

  const navigate = useNavigate()

  const categories = useStore((state) => state.categories)

  const toggleCategory = (category: CategoryType) => {
    const index = selectedCategories.findIndex((c) => c.id === category.id)

    if (index === -1)
      return setSelectedCategories([...selectedCategories, category])

    setSelectedCategories([
      ...selectedCategories.slice(0, index),
      ...selectedCategories.slice(index + 1)
    ])
  }

  const onToggleAllClick = () => {
    if (categories.length === selectedCategories.length)
      return setSelectedCategories([])

    setSelectedCategories(categories)
  }

  const onStart = () => {
    navigate(`/guess/${selectedCategories.map((c) => c.id).join(',')}`)
  }

  return (
    <PageContainer>
      <div className="flex justify-between">
        <Text variant="button">{'Choose categories'}</Text>
        <Button
          size="sm"
          onClick={onToggleAllClick}
          data-test="btn-toggle-select-all"
        >
          {categories.length === selectedCategories.length
            ? 'Clear'
            : 'Select all'}
        </Button>
      </div>
      <SeparatorFull className="my-2" />
      <Categories
        onCategoryClick={toggleCategory}
        selectedCategories={selectedCategories}
      />
      <SeparatorFull className="my-2" />
      <div className="flex justify-end">
        <Button onClick={onStart} data-test="btn-start-game">
          {'Start'}
        </Button>
      </div>
    </PageContainer>
  )
}
