import {
  Row,
  ScrollableContainer,
  ScrollableContainerType,
  useScrollableContainer
} from 'components'
import { Button, ProseDiv, SeparatorFull, Text } from 'ui'
import { useStore, CategoryType } from 'store'
import { capitalizeWords, findLastId, isMobile } from 'utils'
import { toast } from 'react-toastify'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'
import { FiEdit2 } from '@react-icons/all-files/fi/FiEdit2'
import { AiFillFire } from '@react-icons/all-files/ai/AiFillFire'
import { Link, useNavigate } from 'react-router-dom'
import Explanation from './explanation.mdx'
import { useState } from 'react'
import { InputSendIcon } from 'ui/input/input-send-icon'
import { PageContainer } from 'components/layout/container'
import { useControllableList } from '../components/scrollable-container/use-controllable-list'
import { ControllableListInput } from 'components/scrollable-container/controllable-list-input'

export const Category = ({
  category,
  isSelected
}: {
  category: CategoryType
  isSelected?: boolean
}) => {
  const navigate = useNavigate()
  const categoryWords = useStore
    .getState()
    .words.filter((w) => w.categoryId === category.id)

  const onDelete = () => {
    const confirmation = window.confirm(
      `Are you sure you want to delete category "${category.name}"?`
    )
    if (!confirmation) return

    useStore.setState((state) => ({
      categories: state.categories.filter((c) => c.id !== category.id)
    }))
  }

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

  return (
    <Row
      text={category.name}
      onChange={onChange}
      onClick={onClick}
      selectedColor="primary"
      isSelected={isSelected}
      index={categoryWords.length}
      actions={[
        { title: 'Practice', onClick: onPracticeClick, icon: AiFillFire },
        { title: 'Edit', onClick: 'edit', icon: FiEdit2 },
        { title: 'Delete', onClick: onDelete, icon: RiCloseFill, color: 'red' }
      ]}
    />
  )
}

export const Categories = ({
  scrollableContainer,
  controllableList
}: {
  scrollableContainer: ScrollableContainerType
  controllableList: any
}) => {
  const categories = useStore((state) => state.categories)

  return (
    <ScrollableContainer
      height={isMobile() ? 250 : 400}
      scrollableContainer={scrollableContainer}
    >
      <div className="px-2" data-test="categories-list">
        {categories?.length ? (
          categories.map((category, idx) => (
            <Category
              isSelected={controllableList.selectedIdx === idx}
              key={category.id}
              category={category}
            />
          ))
        ) : (
          <ProseDiv>
            <Explanation />
          </ProseDiv>
        )}
      </div>
    </ScrollableContainer>
  )
}

export const CategoriesPage = () => {
  const scrollableContainer = useScrollableContainer({})
  const [newCategoryText, setNewCategoryText] = useState('')
  const categories = useStore((state) => state.categories)
  const navigate = useNavigate()

  const controllableList = useControllableList({
    length: categories.length,
    onEnter: (itemIdx) => {
      navigate(`/category/${categories[itemIdx].id}`)
    },
    scrollableContainer
  })

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return

    onCreateCategory()
  }

  const onCreateCategory = () => {
    if (!newCategoryText) {
      toast.error('Category cannot be empty')
      return
    }

    if (
      useStore.getState().categories.find((c) => c.name === newCategoryText)
    ) {
      toast.error('Category already exists')
      return
    }

    useStore.setState((state) => ({
      categories: [
        ...state.categories,
        {
          id: findLastId(state.categories) + 1,
          name: capitalizeWords(newCategoryText)
        }
      ]
    }))
    setNewCategoryText('')
    scrollableContainer.scrollDown()
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategoryText(event.target.value)
  }

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <Text variant="button">{'Categories'}</Text>
        <Link to="/settings#presets" data-test="btn-use-presets">
          <Button size="md">{'Use presets'}</Button>
        </Link>
      </div>
      <SeparatorFull className="my-2" />
      <Categories
        controllableList={controllableList}
        scrollableContainer={scrollableContainer}
      />
      <SeparatorFull className="my-2" />
      <ControllableListInput
        onKeyDown={onKeyDown}
        data-test="input-new-category"
        type="text"
        placeholder="New category..."
        className={'w-full'}
        value={newCategoryText}
        onChange={onChange}
        autoFocus
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
    </PageContainer>
  )
}
