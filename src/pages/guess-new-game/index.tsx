import { Button, SeparatorFull, Text } from 'ui'
import { PageContainer, Categories } from 'components'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CategoryType, useStore } from 'store'
import { useI18n } from 'i18n'

export const GuessNewGamePage = () => {
  const { t } = useI18n()
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
        <Text variant="button">{t('chooseCategories')}</Text>
        <Button
          size="sm"
          onClick={onToggleAllClick}
          data-test="btn-toggle-select-all"
        >
          {categories.length === selectedCategories.length
            ? t('clear')
            : t('selectAll')}
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
          {t('start')}
        </Button>
      </div>
    </PageContainer>
  )
}
