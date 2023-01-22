import {
  PageContainer,
  useScrollableContainer,
  useControllableList,
  ControllableListInput,
  ControllableListContext,
  ScrollableContainerType
} from 'components'
import { SeparatorFull, Text, InputSendIcon } from 'ui'
import isHotkey from 'is-hotkey'
import { CategoryType, useStore, WordType } from 'store'
import { capitalizeWords, compareStrings, findLastId, pronounce } from 'utils'
import { toast } from 'react-toastify'
import { Navigate, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Words } from './words'
import { Header } from './header'

const WrappedWords = ({
  scrollableContainer,
  filteredWords
}: {
  scrollableContainer: ScrollableContainerType
  filteredWords: WordType[]
}) => {
  return (
    <Words scrollableContainer={scrollableContainer} words={filteredWords} />
  )
}

export const CategoryPageCore = ({ category }: { category: CategoryType }) => {
  const scrollableContainer = useScrollableContainer({})
  const navigate = useNavigate()
  const [newWord, setNewWord] = useState<string>('')
  const words = useStore((state) => state.words)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredWords = useMemo(
    () => words.filter((w) => w.categoryId === category.id),
    [words, category]
  )

  const controllableList = useControllableList({
    length: filteredWords.length,
    onPronounce: (itemIdx) => {
      const word = filteredWords[itemIdx]
      pronounce(word.text)
    },
    onEnter: (itemIdx) => {
      navigate(`/word/${filteredWords[itemIdx].id}`)
    },
    onDelete: (itemIdx) => {
      useStore.getState().deleteWord(filteredWords[itemIdx].id)
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
        (w) => compareStrings(w.text, newWord) && w.categoryId === category.id
      )
    ) {
      toast.error('Word in this category already exists')
      inputRef.current?.select()
      return
    }

    const id = findLastId(words) + 1
    const newWordObject = {
      id,
      text: capitalizeWords(newWord),
      categoryId: category.id
    }

    useStore.setState({ words: [...words, newWordObject] })
    setNewWord('')
    scrollableContainer.scrollDown()
  }, [newWord, words, category, scrollableContainer, filteredWords])

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!newWord && isHotkey(['mod+left', 'ctrl+left'], e)) {
      navigate(-1)
      return
    }

    if (!newWord && isHotkey(['mod+right', 'ctrl+right'], e)) {
      navigate(1)
      return
    }

    if (isHotkey('enter', e)) {
      onCreateWord()
    }
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewWord(event.target.value)
  }

  return (
    <PageContainer>
      <ControllableListContext.Provider value={controllableList}>
        <Text variant="button">{category?.name}</Text>
        <Header category={category} />
        <WrappedWords
          scrollableContainer={scrollableContainer}
          filteredWords={filteredWords}
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
          ref={inputRef}
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
      </ControllableListContext.Provider>
    </PageContainer>
  )
}

export const CategoryPage = () => {
  const categoryId = useParams<{ id: string }>().id || -1
  const categories = useStore((state) => state.categories)

  const category = categories.find((c) => c.id === +categoryId)

  if (!category) return <Navigate to="/" />

  return <CategoryPageCore category={category} />
}
