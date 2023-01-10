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
import { CategoryType, useStore, WordType } from 'store'
import { findLastId } from 'utils'
import { toast } from 'react-toastify'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'
import { Navigate, useParams } from 'react-router-dom'
import { FiEdit2 } from '@react-icons/all-files/fi/FiEdit2'
import { useNavigate } from 'react-router-dom'
import { TooltipWrapper } from 'react-tooltip'
import { useState } from 'react'
import { MdSend } from '@react-icons/all-files/md/MdSend'

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

  if (!words.length)
    return (
      <Text color="gray-light" className="text-center">
        {'No words yet. Add some! 🔥'}
      </Text>
    )

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
        placeholder="New Word..."
        className="w-full"
        value={newWord}
        onChange={onChange}
        autoFocus
        big
        icon={
          <TooltipWrapper content="Send (Enter key)" place="right">
            <button
              onClick={onCreateWord}
              className="absolute top-0 bottom-0 right-0 flex items-center justify-center px-2 transition cursor-pointer text-slate-500 hover:text-green-500"
            >
              <MdSend className="w-5 h-5" />
            </button>
          </TooltipWrapper>
        }
      />
      <div className="flex justify-end mt-2 space-x-2">
        <Button onClick={onPracticeClick}>{'Practice'}</Button>
        <Button color="gray" onClick={resetCategoryWords}>
          {'Reset'}
        </Button>
      </div>
    </div>
  )
}
