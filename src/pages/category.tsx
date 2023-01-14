import {
  Input,
  Row,
  SeparatorFull,
  Text,
  ScrollableContainer,
  ScrollableContainerType,
  useScrollableContainer,
  Button,
  ActionType
} from 'components'
import { CategoryType, useStore, WordType } from 'store'
import { findLastId } from 'utils'
import { toast } from 'react-toastify'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'
import { BsDot } from '@react-icons/all-files/bs/BsDot'
import { Navigate, useParams } from 'react-router-dom'
import { FiEdit2 } from '@react-icons/all-files/fi/FiEdit2'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { InputSendIcon } from 'components/input/input-send-icon'
import { PageContainer } from 'components/layout/container'

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

  const actions: ActionType[] = [
    { title: 'Edit', icon: FiEdit2, onClick: 'edit' },
    { title: 'Delete', icon: RiCloseFill, onClick: onDelete, color: 'red' },
    ...(!!word?.descriptions?.length
      ? [
          {
            title: 'Has descriptions',
            icon: BsDot,
            color: 'textPrimary',
            alwaysShow: true
          } as ActionType
        ]
      : [])
  ]

  return (
    <Row
      text={word.text}
      onChange={onChange}
      index={index}
      onClick={onEditClick}
      actions={actions}
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

  if (!words.length)
    return (
      <Text color="gray-light" className="text-center">
        {'No words yet. Add some! 🔥'}
      </Text>
    )

  return (
    <ScrollableContainer scrollableContainer={scrollableContainer}>
      <div className="px-2" data-test="words-list">
        {words
          .filter((w) => w.categoryId === categoryId)
          .map((word, index) => (
            <Word key={word.id} index={index + 1} word={word} />
          ))}
      </div>
    </ScrollableContainer>
  )
}

export const CategoryPage = () => {
  const categoryId = useParams<{ id: string }>().id || -1
  const categories = useStore((state) => state.categories)

  const category = categories.find((c) => c.id === +categoryId)

  if (!category) return <Navigate to="/" />

  return <CategoryPageCore category={category} />
}

export const CategoryPageCore = ({ category }: { category: CategoryType }) => {
  const scrollableContainer = useScrollableContainer({ scrollOnLoad: true })
  const navigate = useNavigate()
  const [newWord, setNewWord] = useState<string>('')

  const onCreateWord = () => {
    if (!newWord) {
      toast.error('Word cannot be empty')
      return
    }

    const words = useStore.getState().words

    if (words.find((w) => w.text === newWord && w.categoryId === category.id)) {
      toast.error('Word in this category already exists')
      return
    }

    const id = findLastId(words) + 1
    const newWordObject = { id, text: newWord, categoryId: category.id }

    useStore.setState({ words: [...words, newWordObject] })
    setNewWord('')
    scrollableContainer.scrollDown()
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return

    onCreateWord()
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewWord(event.target.value)
  }

  const resetCategoryWords = () => {
    if (!window.confirm('Are you sure?')) return

    useStore.setState((s) => ({
      words: s.words.filter((w) => w.categoryId !== category.id)
    }))
  }

  const onPracticeClick = () => {
    navigate(`/practice/${category.id}`)
  }

  return (
    <PageContainer>
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
        placeholder="New Word..."
        className="w-full"
        value={newWord}
        data-test="input-new-word"
        onChange={onChange}
        autoFocus
        big
        icon={
          <InputSendIcon onClick={onCreateWord} title={'Send (Enter key)'} />
        }
      />
      <div className="flex justify-start mt-6 space-x-2">
        <Button size="md" onClick={onPracticeClick}>
          {'Practice Category'}
        </Button>
        <Button size="md" color="gray" onClick={resetCategoryWords}>
          {'Reset'}
        </Button>
      </div>
    </PageContainer>
  )
}
