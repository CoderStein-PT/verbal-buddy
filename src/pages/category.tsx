import {
  Input,
  Row,
  SeparatorFull,
  Text,
  ScrollableContainer,
  ScrollableContainerType,
  useScrollableContainer
} from 'components'
import { CategoryType, useStore, WordType } from 'store'
import { findLastId } from 'utils'
import { toast } from 'react-toastify'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'
import { useParams } from 'react-router-dom'
import { FiEdit2 } from '@react-icons/all-files/fi/FiEdit2'
import { useNavigate } from 'react-router-dom'

export const Word = ({ word, index }: { word: WordType; index: number }) => {
  const navigate = useNavigate()

  const onDelete = () => {
    useStore.setState((s) => ({
      words: s.words.filter((w) => w.id !== word.id)
    }))
  }

  const onChange = (text: string | undefined) => {
    if (!text) {
      toast.error('Word cannot be empty')
      return
    }

    const words = useStore.getState().words

    if (words.find((w) => w.text === text && w.id !== word.id)) {
      toast.error('Word already exists')
      return
    }

    useStore.setState({
      words: words.map((w) => (w.id === word.id ? { ...w, text } : w))
    })
  }

  const onEditClick = () => {
    navigate(`/word/${word.id}`)
  }

  return (
    <Row
      text={word.text}
      onChange={onChange}
      index={index}
      onClick={onEditClick}
      actions={[
        { title: 'Edit', icon: FiEdit2, onClick: 'edit' },
        { title: 'Delete', icon: RiCloseFill, onClick: onDelete, color: 'red' }
      ]}
    />
  )
}

export const Words = ({
  categoryId,
  scrollableContainer
}: {
  categoryId: number
  scrollableContainer: ScrollableContainerType
}) => {
  const words = useStore((state) => state.words)

  return (
    <ScrollableContainer scrollableContainer={scrollableContainer}>
      {words
        .filter((w) => w.categoryId === categoryId)
        .map((word, index) => (
          <Word key={word.id} index={index + 1} word={word} />
        ))}
    </ScrollableContainer>
  )
}

export const CategoryPage = () => {
  const categoryId = useParams<{ id: string }>().id
  const categories = useStore((state) => state.categories)

  if (!categoryId) return null
  const category = categories.find((c) => c.id === +categoryId)

  if (!category) return null

  return <CategoryPageCore category={category} />
}

export const CategoryPageCore = ({ category }: { category: CategoryType }) => {
  const scrollableContainer = useScrollableContainer({ scrollOnLoad: true })

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return

    const text = event.currentTarget.value
    if (!text) {
      toast.error('Word cannot be empty')
      return
    }

    const words = useStore.getState().words

    if (words.find((w) => w.text === text && w.categoryId === category.id)) {
      toast.error('Word in this category already exists')
      return
    }

    const id = findLastId(words) + 1
    const newWord = { id, text, categoryId: category.id }

    useStore.setState({ words: [...words, newWord] })
    event.currentTarget.value = ''
    scrollableContainer.scrollContainerDown()
  }

  return (
    <div className="w-[400px] mx-auto">
      <Text variant="button">{category?.name}</Text>
      <SeparatorFull className="w-full my-2" />
      <Words
        scrollableContainer={scrollableContainer}
        categoryId={category.id}
      />
      <SeparatorFull className="my-2" />
      <Input
        onKeyDown={onKeyDown}
        type="text"
        placeholder="New word..."
        className="w-full mt-2"
      />
    </div>
  )
}
