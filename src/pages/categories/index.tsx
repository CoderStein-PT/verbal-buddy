import {
  Row,
  PageContainer,
  ScrollableContainer,
  ScrollableContainerType,
  useScrollableContainer,
  useControllableList,
  ControllableListInput,
  ControllableListContext,
  FloatingSelector
} from 'components'
import { Button, ProseDiv, SeparatorFull, Text, InputSendIcon } from 'ui'
import { useStore, CategoryType } from 'store'
import { capitalizeWords, findLastId, isMobile, pronounce } from 'utils'
import { toast } from 'react-toastify'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'
import { FiEdit2 } from '@react-icons/all-files/fi/FiEdit2'
import { AiFillFire } from '@react-icons/all-files/ai/AiFillFire'
import { AiFillSound } from '@react-icons/all-files/ai/AiFillSound'
import { Link, useNavigate } from 'react-router-dom'
import Explanation from './explanation.mdx'
import { useState } from 'react'
import React from 'react'
import isHotkey from 'is-hotkey'

export const Category = ({
  category,
  isSelected,
  onDelete
}: {
  category: CategoryType
  isSelected?: boolean
  onDelete: (category: CategoryType) => void
}) => {
  const navigate = useNavigate()
  const categoryWords = useStore
    .getState()
    .words.filter((w) => w.categoryId === category.id)

  const onChange = (text: string | undefined) => {
    if (!text) {
      toast.error('Category cannot be empty')
      return
    }

    const categories = useStore.getState().categories

    if (categories.find((c) => c.name === text && c.id !== category.id)) {
      toast.error('Category already exists')
      return
    }

    useStore.setState({
      categories: categories.map((c) =>
        c.id === category.id ? { ...c, name: text } : c
      )
    })
  }

  const onClick = () => {
    navigate(`/category/${category.id}`)
  }

  const onPracticeClick = () => {
    navigate(`/practice/${category.id}`)
  }

  const onDelete2 = () => {
    onDelete(category)
  }

  const onPronounce = () => {
    pronounce(category.name)
  }

  return (
    <Row
      text={category.name}
      onChange={onChange}
      onClick={onClick}
      selectedColor="primary"
      isSelected={isSelected}
      index={categoryWords.length}
      actions={[
        {
          title: 'Pronounce',
          onClick: onPronounce,
          icon: AiFillSound,
          color: 'gray'
        },
        { title: 'Practice', onClick: onPracticeClick, icon: AiFillFire },
        { title: 'Edit', onClick: 'edit', icon: FiEdit2 },
        { title: 'Delete', onClick: onDelete2, icon: RiCloseFill, color: 'red' }
      ]}
    />
  )
}

export const CategoriesCore = ({
  scrollableContainer,
  onDelete
}: {
  scrollableContainer: ScrollableContainerType
  onDelete: (category: CategoryType) => void
}) => {
  const categories = useStore((state) => state.categories)

  return (
    <ScrollableContainer
      height={isMobile() ? 250 : 400}
      scrollableContainer={scrollableContainer}
    >
      <div className="px-2" data-test="categories-list">
        {categories?.length ? (
          categories.map((category) => (
            <Category
              key={category.id}
              category={category}
              onDelete={onDelete}
            />
          ))
        ) : (
          <ProseDiv>
            <Explanation />
          </ProseDiv>
        )}
      </div>
      <FloatingSelector scrollableContainer={scrollableContainer} />
    </ScrollableContainer>
  )
}

export const Categories = React.memo(CategoriesCore)

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
      navigate(`/category/${categories[itemIdx].id}`)
    },
    onDelete: (itemIdx) => {
      onDelete(categories[itemIdx])
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
              ? categories[controllableList.selectedIdx].name
              : undefined
          }
        />
      </ControllableListContext.Provider>
    </PageContainer>
  )
}
