import {
  Row,
  PageContainer,
  ScrollableContainer,
  ScrollableContainerType,
  useScrollableContainer,
  ActionType,
  InfoType,
  ControllableListType,
  useControllableList,
  ControllableListInput,
  namesByKeys,
  PropKeyType
} from 'components'
import { Button, SeparatorFull, Text, InputSendIcon } from 'ui'
import { CategoryType, useStore, WordType } from 'store'
import { capitalizeWords, findLastId } from 'utils'
import { toast } from 'react-toastify'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'
import { GiPlainCircle } from '@react-icons/all-files/gi/GiPlainCircle'
import { Navigate, useParams } from 'react-router-dom'
import { FiEdit2 } from '@react-icons/all-files/fi/FiEdit2'
import { useNavigate } from 'react-router-dom'
import { useCallback, useMemo, useState } from 'react'

const possibleInfo: { key: PropKeyType; icon: any; class: string }[] = [
  {
    key: 'definitions',
    icon: GiPlainCircle,
    class: 'text-2xs px-0.5'
  },
  {
    key: 'props',
    icon: GiPlainCircle,
    class: 'text-2xs px-0.5'
  },
  {
    key: 'opposites',
    icon: GiPlainCircle,
    class: 'text-2xs px-0.5'
  }
]

export const Word = ({
  word,
  index,
  isSelected
}: {
  word: WordType
  index: number
  isSelected?: boolean
}) => {
  const navigate = useNavigate()

  const onChange = useCallback(
    (text: string | undefined) => {
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
    },
    [word.id]
  )

  const onEditClick = useCallback(() => {
    navigate(`/word/${word.id}`)
  }, [word.id, navigate])

  const actions: ActionType[] = useMemo(() => {
    const onDelete = () => {
      useStore.setState((s) => ({
        words: s.words.filter((w) => w.id !== word.id)
      }))
    }
    return [
      { title: 'Edit', icon: FiEdit2, onClick: 'edit' },
      { title: 'Delete', icon: RiCloseFill, onClick: onDelete, color: 'red' }
    ]
  }, [word])

  const infos: InfoType[] = useMemo(() => {
    return possibleInfo.map((i) => ({
      ...i,
      title:
        'Has' +
        (word[i.key]?.length ? ' ' + word[i.key]?.length : ' no') +
        ' ' +
        namesByKeys[i.key][0].toLowerCase(),
      class:
        i.class +
        ' ' +
        (word[i.key]?.length
          ? 'text-green-500 shadow-primary-light-sm'
          : 'text-gray-500')
    }))
  }, [word])

  return (
    <Row
      text={word.text}
      onChange={onChange}
      index={index}
      selectedColor="primary"
      onClick={onEditClick}
      actions={actions}
      isSelected={isSelected}
      info={infos}
    />
  )
}

export const Words = ({
  words,
  scrollableContainer,
  controllableList
}: {
  words: WordType[]
  scrollableContainer: ScrollableContainerType
  controllableList: ControllableListType
}) => {
  if (!words.length)
    return (
      <Text color="gray-light" className="text-center">
        {'No words yet. Add some! 🔥'}
      </Text>
    )

  return (
    <ScrollableContainer scrollableContainer={scrollableContainer}>
      <div className="px-2" data-test="words-list">
        {words.map((word, index) => (
          <Word
            key={word.id}
            index={index + 1}
            word={word}
            isSelected={controllableList.selectedIdx === index}
          />
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
  const scrollableContainer = useScrollableContainer({})
  const navigate = useNavigate()
  const [newWord, setNewWord] = useState<string>('')
  const words = useStore((state) => state.words)

  const filteredWords = useMemo(
    () => words.filter((w) => w.categoryId === category.id),
    [words, category]
  )

  const controllableList = useControllableList({
    length: filteredWords.length,
    onEnter: (itemIdx) => {
      navigate(`/word/${filteredWords[itemIdx].id}`)
    },
    scrollableContainer
  })

  const onCreateWord = useCallback(() => {
    if (!newWord) {
      toast.error('Word cannot be empty')
      return
    }

    if (
      filteredWords.find(
        (w) => w.text === newWord && w.categoryId === category.id
      )
    ) {
      toast.error('Word in this category already exists')
      return
    }

    const id = findLastId(filteredWords) + 1
    const newWordObject = {
      id,
      text: capitalizeWords(newWord),
      categoryId: category.id
    }

    useStore.setState({ words: [...filteredWords, newWordObject] })
    setNewWord('')
    scrollableContainer.scrollDown()
  }, [newWord, category, scrollableContainer, filteredWords])

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      navigate(-1)
      return
    }

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
        controllableList={controllableList}
        scrollableContainer={scrollableContainer}
        words={filteredWords}
      />
      <SeparatorFull className="my-2" />
      <ControllableListInput
        onKeyDown={onKeyDown}
        data-test="input-new-word"
        type="text"
        placeholder="New word..."
        className="w-full"
        value={newWord}
        onChange={onChange}
        autoFocus
        big
        icon={
          <InputSendIcon onClick={onCreateWord} title={'Send (Enter key)'} />
        }
        controllableList={controllableList}
        selectedItemText={
          controllableList.selectedIdx !== null
            ? filteredWords[controllableList.selectedIdx].text
            : undefined
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
