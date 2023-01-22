import {
  PageContainer,
  useScrollableContainer,
  useControllableList,
  ControllableListInput,
  ControllableListContext
} from 'components'
import { Button, SeparatorFull, Text, InputSendIcon } from 'ui'
import { useStore, CategoryType } from 'store'
import { capitalizeWords, findLastId, pronounce } from 'utils'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import React from 'react'
import isHotkey from 'is-hotkey'
import { Categories } from './categories'

export const CategoriesPage = () => {
  const scrollableContainer = useScrollableContainer({})
  const [newCategoryText, setNewCategoryText] = useState('')
  const categories = useStore((state) => state.categories)
  const navigate = useNavigate()
  const inputRef = React.useRef<HTMLInputElement>(null)

  const onDelete = (category: CategoryType) => {
    const confirmation = window.confirm(
      `Are you sure you want to delete category "${category.name}"?`
    )
    if (!confirmation) return

    useStore.getState().deleteCategory(category.id)
  }

  const controllableList = useControllableList({
    length: categories.length,
    onPronounce: (itemIdx) => {
      pronounce(categories[itemIdx]?.name)
    },
    onEnter: (itemIdx) => {
      const cat = categories[itemIdx]
      if (!cat) return
      navigate(`/category/${cat.id}`)
    },
    onDelete: (itemIdx) => {
      const cat = categories[itemIdx]
      if (!cat) return
      onDelete(cat)
    },
    scrollableContainer
  })

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isHotkey(['mod+right', 'ctrl+right'], e)) {
      navigate(1)
      return
    }

    if (e.key !== 'Enter') return

    onCreateCategory()
  }

  const onCreateCategory = () => {
    if (!newCategoryText) {
      toast.error('Category cannot be empty')
      return
    }

    if (categories.find((c) => c.name === newCategoryText)) {
      toast.error('Category already exists')
      inputRef.current?.select()
      return
    }

    const newId = findLastId(categories) + 1
    const newName = capitalizeWords(newCategoryText)

    useStore.setState({
      categories: [...categories, { id: newId, name: newName }]
    })
    setNewCategoryText('')
    scrollableContainer.scrollDown()
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategoryText(event.target.value)
  }

  return (
    <PageContainer>
      <ControllableListContext.Provider value={controllableList}>
        <div className="flex items-center justify-between">
          <Text variant="button">{'Categories'}</Text>
          <Link to="/settings#presets" data-test="btn-use-presets">
            <Button color="grayPrimary" size="md">
              {'Use presets'}
            </Button>
          </Link>
        </div>
        <SeparatorFull className="my-2" />
        <Categories
          scrollableContainer={scrollableContainer}
          onDelete={onDelete}
        />
        <SeparatorFull className="my-2" />
        <ControllableListInput
          onKeyDown={onKeyDown}
          data-test="input-new-category"
          type="text"
          placeholder="New category..."
          className="w-full"
          value={newCategoryText}
          onChange={onChange}
          autoFocus
          ref={inputRef}
          big
          icon={
            <InputSendIcon
              onClick={onCreateCategory}
              title={'Send (Enter key)'}
            />
          }
          controllableList={controllableList}
          selectedItemText={
            controllableList.selectedIdx !== null
              ? categories[controllableList.selectedIdx]?.name
              : undefined
          }
        />
      </ControllableListContext.Provider>
    </PageContainer>
  )
}
