import {
  Input,
  Row,
  SeparatorFull,
  Text,
  ScrollableContainer,
  ScrollableContainerType,
  useScrollableContainer,
  Button
} from 'components'
import { useStore, CategoryType } from 'store'
import { findLastId } from 'utils'
import { toast } from 'react-toastify'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'
import { FiEdit2 } from '@react-icons/all-files/fi/FiEdit2'
import { AiFillFire } from '@react-icons/all-files/ai/AiFillFire'
import { MdSend } from '@react-icons/all-files/md/MdSend'
import { Link, useNavigate } from 'react-router-dom'
import Explanation from './explanation.mdx'
import { TooltipWrapper } from 'react-tooltip'
import { useState } from 'react'

export const Category = ({ category }: { category: CategoryType }) => {
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
  scrollableContainer
}: {
  scrollableContainer: ScrollableContainerType
}) => {
  const categories = useStore((state) => state.categories)

  return (
    <ScrollableContainer height={400} scrollableContainer={scrollableContainer}>
      <div className="px-2">
        {categories?.length ? (
          categories.map((category) => (
            <Category key={category.id} category={category} />
          ))
        ) : (
          <div className="prose dark:prose-invert prose-slate">
            <Explanation />
          </div>
        )}
      </div>
    </ScrollableContainer>
  )
}

export const CategoriesPage = () => {
  const scrollableContainer = useScrollableContainer({})
  const [newCategoryText, setNewCategoryText] = useState('')

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
        { id: findLastId(state.categories) + 1, name: newCategoryText }
      ]
    }))
    setNewCategoryText('')
    scrollableContainer.scrollDown()
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategoryText(event.target.value)
  }

  return (
    <div className="mx-auto w-[400px]">
      <div className="flex items-center justify-between">
        <Text variant="button">{'Categories'}</Text>
        <Link to="/settings">
          <Button size="md">{'Use presets'}</Button>
        </Link>
      </div>
      <SeparatorFull className="my-2" />
      <Categories scrollableContainer={scrollableContainer} />
      <SeparatorFull className="my-2" />
      <Input
        onKeyDown={onKeyDown}
        type="text"
        placeholder="New category..."
        className="w-full"
        value={newCategoryText}
        onChange={onChange}
        autoFocus
        big
        icon={
          <TooltipWrapper content="Send (Enter key)" place="right">
            <button
              onClick={onCreateCategory}
              className="absolute top-0 bottom-0 right-0 flex items-center justify-center px-2 transition cursor-pointer text-slate-500 hover:text-green-500"
            >
              <MdSend className="w-5 h-5" />
            </button>
          </TooltipWrapper>
        }
      />
    </div>
  )
}
