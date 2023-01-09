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
import { Link, useNavigate } from 'react-router-dom'
import Explanation from './explanation.mdx'

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

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const newCategory = event.currentTarget.value
      if (!newCategory) {
        toast.error('Category cannot be empty')
        return
      }

      if (useStore.getState().categories.find((c) => c.name === newCategory)) {
        toast.error('Category already exists')
        return
      }

      useStore.setState((state) => ({
        categories: [
          ...state.categories,
          { id: findLastId(state.categories) + 1, name: newCategory }
        ]
      }))
      event.currentTarget.value = ''
      scrollableContainer.scrollDown()
    }
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
        autoFocus
        big
      />
    </div>
  )
}
